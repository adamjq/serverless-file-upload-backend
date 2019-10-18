import gql from 'graphql-tag'

export const RECORD_UPLOAD_MUTATION = gql`
    mutation updateTaskProgress($location: String!, $update: UpdateUploadInput!) {
        updateUpload(location: $location, update: $update) {
            id
        }
    }
`
