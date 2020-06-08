import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { 
    getUserById, 
    getUserByEmail,
    getTimeRecordsForUser, 
    getTasksForUser, 
    isAuthenticated, 
    getId, 
    createUser
} from './resolverUtils';
import { 
    AuthData,
    RootQueryLoginArgs, 
    RootMutationCreateUserArgs, 
    UserInputData, 
    UserTasksArgs, 
    TimeFrames 
} from '../generated';
import { UserDocument } from '../../types';
import { DEFAULT_TOKEN } from '../../utils/constants';

export async function addUser(userInput: UserInputData) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
        errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
        validator.isEmpty(userInput.password) ||
        !validator.isLength(userInput.password, { min: 5 })
    ) {
        errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
        const error = new Error('Invalid input.') as any;
        error.data = errors;
        error.statusCode = 422;
        throw error;
    }
    const existingUser = await getUserByEmail(userInput.email);
    if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    return await createUser(
        userInput.email,
        hashedPw,
        userInput.name
    );
}

export async function login(email: string, password: string): Promise<AuthData> {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error('User not found.');
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect.');
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      process.env.APP_SECRET || DEFAULT_TOKEN,
      { expiresIn: '1h' }
    );

    return { 
        token: token, 
        userId: user._id.toString() 
    };
}

export default {
    RootQuery: {
        login: (_: void, args: RootQueryLoginArgs) => 
            login(args.email, args.password),
        user: isAuthenticated((_: void, args: void, context: Express.Request) => 
            getUserById(context.userId!))
    },
    RootMutation: {
        createUser: (_: void, args: RootMutationCreateUserArgs) => 
            addUser(args.userInput)
    },
    User: {
        id: getId,
        timeRecords: (parent: UserDocument) =>
            getTimeRecordsForUser(parent._id),
        tasks: (parent: UserDocument, args: UserTasksArgs) =>
            getTasksForUser(
                parent._id, 
                args.completed || false, 
                args.timeFrame || TimeFrames.Day
            )
    }
};
