import { 
    getTaskById, 
    getUserById, 
    getTimeRecordsForTask, 
    isAuthenticated, 
    updateTaskById, 
    getId, 
    createTask
} from './resolverUtils';
import { 
    RootQueryTaskArgs, 
    RootMutationAddTaskArgs, 
    RootMutationCompleteTaskArgs 
} from '../generated';
import { TaskDocument } from '../../types';

export default {
    RootQuery: {
        task: isAuthenticated((_: void, args: RootQueryTaskArgs) => 
            getTaskById(args.id))
    },
    RootMutation: {
        addTask: isAuthenticated((
            _: void, 
            args: RootMutationAddTaskArgs, 
            context: Express.Request
        ) => 
            createTask(args.title, context.userId!)
        ),
        completeTask: isAuthenticated((
            _: void, 
            args: RootMutationCompleteTaskArgs
        ) => 
            updateTaskById(args.id, { isCompleted: true })
        )
    },
    Task: {
        id: getId,  
        user: (parent: TaskDocument) => 
            getUserById(parent.user),
        timeRecords: (parent: TaskDocument) => 
            getTimeRecordsForTask(parent._id)
    }
};
