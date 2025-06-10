import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { v4 as uuidv4 } from "uuid"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const regNumber = formData.get("regNumber") as string
  if (!file || !regNumber) {
    return NextResponse.json({ error: "Missing file or regNumber" }, { status: 400 })
  }
  const ext = file.name.split(".").pop() || "jpg"
  const filename = `${regNumber}_${uuidv4()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadPath = path.join(process.cwd(), "public", "profile-photos", filename)
  await fs.writeFile(uploadPath, buffer)
  return NextResponse.json({ filename })
}
