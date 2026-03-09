export const sendToCentralApi = async (data: {
  projectName: string
  email: string
  firstName: string
  surname?: string | null
  title: string
  body: string
}) => {
  const res = await fetch(
    "https://contact-form-panel.happencode.cloud/api/Submission",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  )

  if (!res.ok) {
    throw new Error("Central API error")
  }
}
