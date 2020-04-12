import * as userResolvers from './userResolvers';
import * as timerResolvers from './timerResolvers';

export default {
    ...userResolvers,
    ...timerResolvers
};