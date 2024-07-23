import { NextRequest, NextResponse } from 'next/server'
import postureData from '@interfaces/postureData'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<postureData>
// ) {
//   switch (req.method) {
//     case 'GET': {
//       // Handle GET request
//       const response = await fetch('https://www.pocketyoga.com/poses.json')
//       const data = await response.json()
//       const dataWithId = data.map((item: postureData, index: number) => ({
//         ...item,
//         id: index + 1,
//       }))
//       // console.log('dataWithId', dataWithId)
//       res.status(200).json(dataWithId)
//       break
//     }
//     // Add cases for other HTTP methods (POST, PUT, DELETE, etc.)
//     default:
//       res.setHeader('Allow', ['GET'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

export async function GET(req: NextRequest, res: NextResponse<postureData>) {
  // Handle GET request
  const response = await fetch('https://www.pocketyoga.com/poses.json')
  const data = await response.json()
  const dataWithId: postureData = data.map(
    (item: postureData, index: number) => ({
      ...item,
      id: index + 1,
    })
  )
  // console.log('dataWithId', dataWithId)
  // console.log('data', data)
  // console.log('response', response.body)
  // console.log('response.status', response.status)

  return NextResponse.json(dataWithId)
}
