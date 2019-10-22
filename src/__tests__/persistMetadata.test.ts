import { buildUpdate } from "../processors/persistMetadata"
import { GQLUpdateUploadInput, GQLUploadStatus } from "../types/graphql"

describe("Persist Metadata tests", () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("update build", async () => {

      const processResults = [
        {
          "size": 138879,
          "mimeType": "image/png"
        },
        {
          "thumbnail": null,
        },
        {
          "status": "COMPLETED"
        }
      ]

      const expectedUpdate: GQLUpdateUploadInput = {
          status: GQLUploadStatus.COMPLETED,
          size: 138879,
          mimeType: "image/png",
          thumbnail: undefined,
      }

      const update = buildUpdate(processResults)
      expect(update).toEqual(expectedUpdate)
  })

})
