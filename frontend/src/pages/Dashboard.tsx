import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Upload, Image as ImageIcon, Trash2, Eye, Grid, Download } from 'lucide-react'
import { api } from '@/lib/api'

import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

interface Image {
  _id: string
  title: string
  description?: string
  url: string
  format: string
  size: number
  width: number
  height: number
  createdAt: string
}

export default function Dashboard() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<Image | null>(null)

  // Simple file size formatting function
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Simple date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await api.get('/images')
      setImages(response.data.data.images)
    } catch (error: any) {
      toast.error('Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (image: Image) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!imageToDelete) return
    
    try {
      await api.delete(`/images/${imageToDelete._id}`)
      setImages(images.filter(img => img._id !== imageToDelete._id))
      toast.success('Image deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete image')
    } finally {
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleUploadSuccess = (newImage: Image) => {
    setImages([newImage, ...images])
    setShowUpload(false)
    toast.success('Image uploaded successfully!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Loading your gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Gallery
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage and organize your uploaded images
            </p>
            {images.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Grid className="h-4 w-4" />
                <span>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setShowUpload(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Image
          </Button>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <ImageUpload
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUpload(false)}
          />
        )}

        {/* Images Grid */}
        {images.length === 0 ? (
          <Card className="text-center py-16 shadow-xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">No images yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your gallery by uploading your first image. Drag and drop or click to browse.
              </p>
              <Button 
                onClick={() => setShowUpload(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Your First Image
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {images.map((image) => (
              <Card 
                key={image._id} 
                className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-[1.02]"
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(image.url, '_blank')}
                        className="bg-white/90 hover:bg-white text-black border-0 shadow-lg backdrop-blur-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = image.url
                          link.download = image.title
                          link.click()
                        }}
                        className="bg-white/90 hover:bg-white text-black border-0 shadow-lg backdrop-blur-sm"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(image)}
                        className="bg-red-500/90 hover:bg-red-600 border-0 shadow-lg backdrop-blur-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="p-4 space-y-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {image.title}
                    </CardTitle>
                    {image.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                        {image.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        {image.width} × {image.height}
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        {image.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{formatFileSize(image.size)}</span>
                      <span>{formatDate(image.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Image
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Are you sure you want to delete this image?</p>
                {imageToDelete && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mt-3">
                    <p className="font-medium text-sm">{imageToDelete.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {imageToDelete.width} × {imageToDelete.height} • {formatFileSize(imageToDelete.size)}
                    </p>
                  </div>
                )}
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  This action cannot be undone.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Image
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}