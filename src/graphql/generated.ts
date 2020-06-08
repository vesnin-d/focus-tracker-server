import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthData = {
   __typename?: 'AuthData';
  token: Scalars['String'];
  userId: Scalars['String'];
};

export type RootMutation = {
   __typename?: 'RootMutation';
  createUser: User;
  updateStatus: User;
  addTimeRecord: TimeRecord;
  updateTimeRecordDuration: TimeRecord;
  assignTimeRecordToTask: TimeRecord;
  addTask: Task;
  completeTask: Task;
};


export type RootMutationCreateUserArgs = {
  userInput: UserInputData;
};


export type RootMutationUpdateStatusArgs = {
  status: Scalars['String'];
};


export type RootMutationAddTimeRecordArgs = {
  duration: Scalars['Int'];
  taskId?: Maybe<Scalars['ID']>;
};


export type RootMutationUpdateTimeRecordDurationArgs = {
  timeRecordId: Scalars['ID'];
  newDuration: Scalars['Int'];
};


export type RootMutationAssignTimeRecordToTaskArgs = {
  timeRecordId: Scalars['ID'];
  taskId: Scalars['ID'];
};


export type RootMutationAddTaskArgs = {
  title: Scalars['String'];
};


export type RootMutationCompleteTaskArgs = {
  id: Scalars['ID'];
};

export type RootQuery = {
   __typename?: 'RootQuery';
  login: AuthData;
  user: User;
  timeRecord: TimeRecord;
  task: Task;
};


export type RootQueryLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type RootQueryTimeRecordArgs = {
  id: Scalars['ID'];
};


export type RootQueryTaskArgs = {
  id: Scalars['ID'];
};

export type Task = {
   __typename?: 'Task';
  id: Scalars['ID'];
  title: Scalars['String'];
  user: User;
  isCompleted: Scalars['Boolean'];
  timeRecords: Array<TimeRecord>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export enum TimeFrames {
  Month = 'MONTH',
  Week = 'WEEK',
  Day = 'DAY'
}

export type TimeRecord = {
   __typename?: 'TimeRecord';
  id: Scalars['ID'];
  duration: Scalars['Int'];
  user: User;
  task?: Maybe<Task>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  timeRecords: Array<TimeRecord>;
  tasks: Array<Task>;
};


export type UserTasksArgs = {
  completed?: Maybe<Scalars['Boolean']>;
  timeFrame?: Maybe<TimeFrames>;
};

export type UserInputData = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  RootQuery: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  AuthData: ResolverTypeWrapper<AuthData>,
  User: ResolverTypeWrapper<User>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  TimeRecord: ResolverTypeWrapper<TimeRecord>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Task: ResolverTypeWrapper<Task>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  TimeFrames: TimeFrames,
  RootMutation: ResolverTypeWrapper<{}>,
  UserInputData: UserInputData,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  RootQuery: {},
  String: Scalars['String'],
  AuthData: AuthData,
  User: User,
  ID: Scalars['ID'],
  TimeRecord: TimeRecord,
  Int: Scalars['Int'],
  Task: Task,
  Boolean: Scalars['Boolean'],
  TimeFrames: TimeFrames,
  RootMutation: {},
  UserInputData: UserInputData,
};

export type AuthDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthData'] = ResolversParentTypes['AuthData']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RootMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['RootMutation'] = ResolversParentTypes['RootMutation']> = {
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<RootMutationCreateUserArgs, 'userInput'>>,
  updateStatus?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<RootMutationUpdateStatusArgs, 'status'>>,
  addTimeRecord?: Resolver<ResolversTypes['TimeRecord'], ParentType, ContextType, RequireFields<RootMutationAddTimeRecordArgs, 'duration'>>,
  updateTimeRecordDuration?: Resolver<ResolversTypes['TimeRecord'], ParentType, ContextType, RequireFields<RootMutationUpdateTimeRecordDurationArgs, 'timeRecordId' | 'newDuration'>>,
  assignTimeRecordToTask?: Resolver<ResolversTypes['TimeRecord'], ParentType, ContextType, RequireFields<RootMutationAssignTimeRecordToTaskArgs, 'timeRecordId' | 'taskId'>>,
  addTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<RootMutationAddTaskArgs, 'title'>>,
  completeTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<RootMutationCompleteTaskArgs, 'id'>>,
};

export type RootQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['RootQuery'] = ResolversParentTypes['RootQuery']> = {
  login?: Resolver<ResolversTypes['AuthData'], ParentType, ContextType, RequireFields<RootQueryLoginArgs, 'email' | 'password'>>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  timeRecord?: Resolver<ResolversTypes['TimeRecord'], ParentType, ContextType, RequireFields<RootQueryTimeRecordArgs, 'id'>>,
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<RootQueryTaskArgs, 'id'>>,
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  timeRecords?: Resolver<Array<ResolversTypes['TimeRecord']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TimeRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeRecord'] = ResolversParentTypes['TimeRecord']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  timeRecords?: Resolver<Array<ResolversTypes['TimeRecord']>, ParentType, ContextType>,
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<UserTasksArgs, 'completed' | 'timeFrame'>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  AuthData?: AuthDataResolvers<ContextType>,
  RootMutation?: RootMutationResolvers<ContextType>,
  RootQuery?: RootQueryResolvers<ContextType>,
  Task?: TaskResolvers<ContextType>,
  TimeRecord?: TimeRecordResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
