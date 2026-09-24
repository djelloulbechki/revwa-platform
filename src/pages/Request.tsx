import { useState, useRef } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Upload, Send } from "lucide-react"

export default function Request() {
  const [description, setDescription] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      alert("Microphone access denied or not available.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: send to Supabase
    alert("Request submitted! (Connect Supabase to save)")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Start your free request</h1>
          <p className="mt-2 text-muted-foreground">
            Describe what you need. We’ll turn it into a clear technical scope.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
            <CardDescription>
              Be as detailed as you can. You can also record a voice note.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project title (optional)</Label>
                <Input id="title" placeholder="e.g. Custom CRM for sales team" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">What do you need?</Label>
                <Textarea
                  id="description"
                  placeholder="Explain the problem, current tools, desired outcome..."
                  className="min-h-[160px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Voice note (optional)</Label>
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <Button type="button" variant="outline" onClick={startRecording}>
                      <Mic className="mr-2 h-4 w-4" />
                      Start recording
                    </Button>
                  ) : (
                    <Button type="button" variant="destructive" onClick={stopRecording}>
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  )}
                  {audioUrl && (
                    <audio controls src={audioUrl} className="h-10" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company size</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select...</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select...</option>
                    <option>ASAP</option>
                    <option>1-3 months</option>
                    <option>3-6 months</option>
                    <option>6+ months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget min (optional)</Label>
                  <Input type="number" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label>Budget max (optional)</Label>
                  <Input type="number" placeholder="25000" />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full glow">
                <Send className="mr-2 h-4 w-4" />
                Submit free request
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
