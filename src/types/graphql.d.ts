/* tslint:disable */
/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql';
/**
 * This file is auto-generated by graphql-schema-typescript
 * Please note that any changes in this file may be overwritten
 */
 

/*******************************
 *                             *
 *          TYPE DEFS          *
 *                             *
 *******************************/
export interface GQLQuery {
  upload?: GQLUpload;
}

export interface GQLUpload {
  id: string;
  customerId: string;
  name: string;
  location: string;
  status: GQLUploadStatus;
  created: GQLAWSDateTime;
  modified: GQLAWSDateTime;
  description?: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
  downloadURL?: string;
}

export const enum GQLUploadStatus {
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED',
  REJECTED = 'REJECTED'
}

/**
 * The AWSDateTime scalar type represents a valid extended ISO 8601 DateTime string. In other words, this scalar type accepts datetime strings of the form YYYY-MM-DDThh:mm:ss.sssZ. The field after the seconds field is a nanoseconds field. It can accept between 1 and 9 digits. The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used). The time zone offset is compulsory for this scalar. The time zone offset must either be Z (representing the UTC time zone) or be in the format ±hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
 */
export type GQLAWSDateTime = any;

export interface GQLMutation {
  uploadObject: GQLUploadResponse;
  updateUpload?: GQLUpload;
}

export interface GQLUploadObjectInput {
  customerId: string;
  description?: string;
  name: string;
}

export interface GQLUploadResponse {
  upload: GQLUpload;
  uploadURL: GQLAWSURL;
}

/**
 * The AWSURL scalar type represents a valid URL string. The URL may use any scheme and may also be a local URL (Ex: <http://localhost/>). URLs without schemes are considered invalid. URLs which contain double slashes are also considered invalid.
 */
export type GQLAWSURL = any;

export interface GQLUpdateUploadInput {
  name?: string;
  description?: string;
  status: GQLUploadStatus;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
}

export interface GQLSubscription {
  newUploadUpdate?: GQLUpload;
}

export interface GQLSchema {
  query?: GQLQuery;
  mutation?: GQLMutation;
}

/**
 * The AWSDate scalar type represents a valid extended ISO 8601 Date string. In other words, this scalar type accepts date strings of the form YYYY-MM-DD. This scalar type can also accept time zone offsets. For example, 1970-01-01Z, 1970-01-01-07:00 and 1970-01-01+05:30 are all valid dates. The time zone offset must either be Z (representing the UTC time zone) or be in the format ±hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
 */
export type GQLAWSDate = any;

/**
 * The AWSTime scalar type represents a valid extended ISO 8601 Time string. In other words, this scalar type accepts time strings of the form hh:mm:ss.sss. The field after the seconds field is a nanoseconds field. It can accept between 1 and 9 digits. The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used). This scalar type can also accept time zone offsets.
 * For example, 12:30Z, 12:30:24-07:00 and 12:30:24.500+05:30 are all valid time strings.
 * The time zone offset must either be Z (representing the UTC time zone) or be in the format hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
 */
export type GQLAWSTime = any;

/**
 * The AWSTimestamp scalar type represents the number of seconds that have elapsed since 1970-01-01T00:00Z. Timestamps are serialized and deserialized as numbers. Negative values are also accepted and these represent the number of seconds till 1970-01-01T00:00Z.
 */
export type GQLAWSTimestamp = any;

/**
 * The AWSEmail scalar type represents an Email address string that complies with RFC 822. For example, username@example.com is a valid Email address.
 */
export type GQLAWSEmail = any;

/**
 * The AWSJSON scalar type represents a JSON string that complies with RFC 8259.
 * Maps like {\"upvotes\": 10}, lists like [1,2,3], and scalar values like \"AWSJSON example string\", 1, and true are accepted as valid JSON. They will automatically be parsed and loaded in the resolver mapping templates as Maps, Lists, or Scalar values rather than as the literal input strings. Invalid JSON strings like {a: 1}, {'a': 1} and Unquoted string will throw GraphQL validation errors.
 */
export type GQLAWSJSON = any;

/**
 * The AWSPhone scalar type represents a valid Phone Number. Phone numbers are serialized and deserialized as Strings. Phone numbers provided may be whitespace delimited or hyphenated. The number can specify a country code at the beginning but this is not required.
 */
export type GQLAWSPhone = any;

/**
 * The AWSIPAddress scalar type represents a valid IPv4 or IPv6 address string.
 */
export type GQLAWSIPAddress = any;

/*********************************
 *                               *
 *         TYPE RESOLVERS        *
 *                               *
 *********************************/
/**
 * This interface define the shape of your resolver
 * Note that this type is designed to be compatible with graphql-tools resolvers
 * However, you can still use other generated interfaces to make your resolver type-safed
 */
export interface GQLResolver {
  Query?: GQLQueryTypeResolver;
  Upload?: GQLUploadTypeResolver;
  AWSDateTime?: GraphQLScalarType;
  Mutation?: GQLMutationTypeResolver;
  UploadResponse?: GQLUploadResponseTypeResolver;
  AWSURL?: GraphQLScalarType;
  Subscription?: GQLSubscriptionTypeResolver;
  Schema?: GQLSchemaTypeResolver;
  AWSDate?: GraphQLScalarType;
  AWSTime?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSEmail?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
}
export interface GQLQueryTypeResolver<TParent = any> {
  upload?: QueryToUploadResolver<TParent>;
}

export interface QueryToUploadArgs {
  id: string;
}
export interface QueryToUploadResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToUploadArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLUploadTypeResolver<TParent = any> {
  id?: UploadToIdResolver<TParent>;
  customerId?: UploadToCustomerIdResolver<TParent>;
  name?: UploadToNameResolver<TParent>;
  location?: UploadToLocationResolver<TParent>;
  status?: UploadToStatusResolver<TParent>;
  created?: UploadToCreatedResolver<TParent>;
  modified?: UploadToModifiedResolver<TParent>;
  description?: UploadToDescriptionResolver<TParent>;
  size?: UploadToSizeResolver<TParent>;
  mimeType?: UploadToMimeTypeResolver<TParent>;
  thumbnail?: UploadToThumbnailResolver<TParent>;
  downloadURL?: UploadToDownloadURLResolver<TParent>;
}

export interface UploadToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToCustomerIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToLocationResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToStatusResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToCreatedResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToModifiedResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToDescriptionResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToSizeResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToMimeTypeResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToThumbnailResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadToDownloadURLResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLMutationTypeResolver<TParent = any> {
  uploadObject?: MutationToUploadObjectResolver<TParent>;
  updateUpload?: MutationToUpdateUploadResolver<TParent>;
}

export interface MutationToUploadObjectArgs {
  upload: GQLUploadObjectInput;
}
export interface MutationToUploadObjectResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToUploadObjectArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToUpdateUploadArgs {
  location: string;
  update?: GQLUpdateUploadInput;
}
export interface MutationToUpdateUploadResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToUpdateUploadArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLUploadResponseTypeResolver<TParent = any> {
  upload?: UploadResponseToUploadResolver<TParent>;
  uploadURL?: UploadResponseToUploadURLResolver<TParent>;
}

export interface UploadResponseToUploadResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UploadResponseToUploadURLResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLSubscriptionTypeResolver<TParent = any> {
  newUploadUpdate?: SubscriptionToNewUploadUpdateResolver<TParent>;
}

export interface SubscriptionToNewUploadUpdateArgs {
  id: string;
}
export interface SubscriptionToNewUploadUpdateResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToNewUploadUpdateArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToNewUploadUpdateArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface GQLSchemaTypeResolver<TParent = any> {
  query?: SchemaToQueryResolver<TParent>;
  mutation?: SchemaToMutationResolver<TParent>;
}

export interface SchemaToQueryResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SchemaToMutationResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}
