import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export const usePdf = () => {
  const downloadPdf = (content: any, title: string) => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text(title, 20, 20)
    
    // Add content
    doc.setFontSize(12)
    let yPos = 40

    // Handle different content types
    if (typeof content === 'string') {
      const splitText = doc.splitTextToSize(content, 170)
      doc.text(splitText, 20, yPos)
    } else if (Array.isArray(content)) {
      content.forEach((item) => {
        if (typeof item === 'string') {
          const splitText = doc.splitTextToSize(item, 170)
          doc.text(splitText, 20, yPos)
          yPos += 10 * (splitText.length)
        } else if (typeof item === 'object') {
          // Handle object type content (like tables or structured data)
          Object.entries(item).forEach(([key, value]) => {
            doc.setFontSize(14)
            doc.text(`${key}:`, 20, yPos)
            yPos += 10
            doc.setFontSize(12)
            const splitText = doc.splitTextToSize(value as string, 170)
            doc.text(splitText, 20, yPos)
            yPos += 10 * (splitText.length) + 5
          })
        }
      })
    }

    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  }

  return {
    downloadPdf
  }
} 