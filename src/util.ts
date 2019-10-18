/**
 * Extract and return S3 upload object location in format '{Bucket}/{Key}'
 * @param event S3 Lambda trigger event payload containing a single record
 */
export const getS3LocationFromEvent = (event: any): string => {
    const record = event.Records[0]
    return `${record.s3.bucket.name}/${record.s3.object.key}`
}
