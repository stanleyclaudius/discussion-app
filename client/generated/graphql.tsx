import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  replyPost: Post;
  vote: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};


export type MutationReplyPostArgs = {
  content: Scalars['String'];
  postId: Scalars['Int'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  point: Scalars['Int'];
  replyTo: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['Int'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  currentLoginUser?: Maybe<User>;
  getPostById?: Maybe<Post>;
  getPosts: PaginatedPosts;
};


export type QueryGetPostByIdArgs = {
  id: Scalars['Int'];
};


export type QueryGetPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String'];
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string } | null };

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, title?: string | null, point: number, content: string, createdAt: string, updatedAt: string } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string } | null } };

export type ReplyPostMutationVariables = Exact<{
  content: Scalars['String'];
  postId: Scalars['Int'];
}>;


export type ReplyPostMutation = { __typename?: 'Mutation', replyPost: { __typename?: 'Post', id: number, title?: string | null, point: number, content: string, createdAt: string, updatedAt: string } };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type CurrentLoginUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentLoginUserQuery = { __typename?: 'Query', currentLoginUser?: { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string } | null };

export type GetPostByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostById?: { __typename?: 'Post', id: number, title?: string | null, content: string, point: number, userId: number, voteStatus?: number | null, createdAt: string, updatedAt: string, user: { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string } } | null };

export type GetPostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, title?: string | null, content: string, point: number, userId: number, voteStatus?: number | null, createdAt: string, updatedAt: string, user: { __typename?: 'User', id: number, name: string, avatar: string, email: string, createdAt: string, updatedAt: string } }> } };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  name
  avatar
  email
  createdAt
  updatedAt
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    id
    title
    point
    content
    createdAt
    updatedAt
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
  register(
    name: $name
    email: $email
    password: $password
    passwordConfirmation: $passwordConfirmation
  ) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ReplyPostDocument = gql`
    mutation ReplyPost($content: String!, $postId: Int!) {
  replyPost(content: $content, postId: $postId) {
    id
    title
    point
    content
    createdAt
    updatedAt
  }
}
    `;

export function useReplyPostMutation() {
  return Urql.useMutation<ReplyPostMutation, ReplyPostMutationVariables>(ReplyPostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const CurrentLoginUserDocument = gql`
    query CurrentLoginUser {
  currentLoginUser {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useCurrentLoginUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentLoginUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentLoginUserQuery>({ query: CurrentLoginUserDocument, ...options });
};
export const GetPostByIdDocument = gql`
    query GetPostById($id: Int!) {
  getPostById(id: $id) {
    id
    title
    content
    point
    userId
    voteStatus
    user {
      id
      name
      avatar
      email
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
    `;

export function useGetPostByIdQuery(options: Omit<Urql.UseQueryArgs<GetPostByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostByIdQuery>({ query: GetPostByIdDocument, ...options });
};
export const GetPostsDocument = gql`
    query GetPosts($limit: Int!, $cursor: String) {
  getPosts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      id
      title
      content
      point
      userId
      voteStatus
      user {
        id
        name
        avatar
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
}
    `;

export function useGetPostsQuery(options: Omit<Urql.UseQueryArgs<GetPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsQuery>({ query: GetPostsDocument, ...options });
};