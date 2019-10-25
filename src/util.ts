import { S3 } from 'aws-sdk'

// Default time of 1hr
const DOWNLOAD_URL_EXPIRY_TIME = 3600

/**
 * Extract and return S3 upload object location in format '{Bucket}/{Key}'
 * @param event S3 Lambda trigger event payload containing a single record
 */
export const getS3LocationFromEvent = (event: any): string => {
    const record = event.Records[0]
    return `${record.s3.bucket.name}/${record.s3.object.key}`
}

export const getUploadPresignedUrl = (location: string): string => {
    const s3 = new S3({apiVersion: '2006-03-01'})

    const splitLocation = location.split("/")

    const params = {
        Bucket: splitLocation[0],
        Key: splitLocation[1],
        Expires: DOWNLOAD_URL_EXPIRY_TIME
    }
    const signedURL = s3.getSignedUrl('getObject', params)
    return signedURL
}

