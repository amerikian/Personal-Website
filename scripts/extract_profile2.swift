import Foundation
import Vision
import PDFKit
import AppKit

let pdfPath = "/Users/bigdaddy/Downloads/Profile (2).pdf"
let outPath = "/Users/bigdaddy/Personal-Website/artifacts/profile2_ocr.txt"

guard let doc = PDFDocument(url: URL(fileURLWithPath: pdfPath)) else {
    print("ERROR: cannot open pdf")
    exit(2)
}

func ocr(_ cg: CGImage) -> String {
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = true
    req.recognitionLanguages = ["en-US"]
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do {
        try handler.perform([req])
        return (req.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
    } catch {
        return ""
    }
}

var result = ""
for i in 0..<doc.pageCount {
    guard let page = doc.page(at: i) else { continue }
    let textLayer = page.string ?? ""
    if textLayer.trimmingCharacters(in: .whitespacesAndNewlines).count > 20 {
        result += "\n\n--- PAGE \(i + 1) [TEXT] ---\n" + textLayer
    } else {
        let img = page.thumbnail(of: NSSize(width: 2200, height: 2800), for: .mediaBox)
        if let tiff = img.tiffRepresentation,
           let rep = NSBitmapImageRep(data: tiff),
           let cg = rep.cgImage {
            result += "\n\n--- PAGE \(i + 1) [OCR] ---\n" + ocr(cg)
        }
    }
}

try? result.write(toFile: outPath, atomically: true, encoding: .utf8)
print("PAGES", doc.pageCount)
print("CHARS", result.count)
print("OUT", outPath)
print(result.prefix(2500))
