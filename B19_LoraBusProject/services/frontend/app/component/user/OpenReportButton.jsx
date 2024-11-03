import { useState } from 'react';
import ReportModal from './ReportModal';

const OpenReportButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 text-sm rounded ">Report an Issue</button>
      {showModal && <ReportModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default OpenReportButton;
