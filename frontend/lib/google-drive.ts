import { google } from 'googleapis'

const getApiKey = () => {
  const key = process.env.GOOGLE_API_KEY
  if (!key) throw new Error('GOOGLE_API_KEY not set')
  return key
}

export const getDriveClient = () =>
  google.drive({ version: 'v3', auth: getApiKey() })

export interface DriveItem {
  id: string
  name: string
  mimeType: string
  isFolder: boolean
  size?: string
}

export async function listDriveFolder(folderId: string): Promise<DriveItem[]> {
  const drive = getDriveClient()
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id,name,mimeType,size)',
    orderBy: 'name',
    pageSize: 200,
    // Necesario para carpetas en Unidades Compartidas (Shared Drives) de Workspace
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  })
  return (res.data.files ?? []).map((f) => ({
    id: f.id!,
    name: f.name!,
    mimeType: f.mimeType!,
    isFolder: f.mimeType === 'application/vnd.google-apps.folder',
    size: f.size ?? undefined,
  }))
}
