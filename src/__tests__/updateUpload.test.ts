import { updateFields } from "../resolvers/updateUpload"
import { GQLUpload, GQLUploadStatus } from "../types/graphql"

describe("Update Upload tests", () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("update fields applied", async () => {

      const mockTS = 1566453445814
      const mockISODateString = "2019-08-22T05:57:25.814Z" // ISO Date conversion of mock TS
      const dateNowStub = jest.fn(() => mockTS)
      global.Date.now = dateNowStub

      const mockUpload: GQLUpload = {
        "id": "cbcaf35e-d471-4640-bb10-c20c311a0223",
        "name": "File",
        "location": "uploadobjectbucket-207e3ca3/207e3ca3-a5bc-4e6f-9c7f-334885ac884b",
        "description": "This file has been uploaded",
        "status": GQLUploadStatus.CREATED,
        "created": "2019-10-18T04:23:42.852Z",
        "modified": "2019-10-18T04:23:42.852Z",
        "size": undefined,
        "mimeType": undefined,
        "thumbnail": undefined
      }

      const mockUpdate = {
          status: GQLUploadStatus.UPLOADED,
          size: 300,
          mimeType: "image/png"
      }

      const expectedUpdatedUpload: GQLUpload = {
        "id": "cbcaf35e-d471-4640-bb10-c20c311a0223",
        "name": "File",
        "location": "uploadobjectbucket-207e3ca3/207e3ca3-a5bc-4e6f-9c7f-334885ac884b",
        "description": "This file has been uploaded",
        "status": GQLUploadStatus.UPLOADED,
        "created": "2019-10-18T04:23:42.852Z",
        "modified": mockISODateString,
        "size": 300,
        "mimeType": "image/png",
        "thumbnail": undefined
      }

      const result = updateFields(mockUpdate, mockUpload)
      expect(result).toEqual(expectedUpdatedUpload)
  })

})
