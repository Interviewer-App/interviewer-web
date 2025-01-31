"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
// import { defaultLayoutPlugin } from "@react-pdf-viewer/core/lib";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const PdfViewer = ({ url }) => {
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className="h-fit w-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
        //   plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};
export default PdfViewer;