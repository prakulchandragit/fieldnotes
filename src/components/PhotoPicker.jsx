import { useRef, useState } from 'react';
import { Camera, ImagePlus, Trash2 } from 'lucide-react';
import { fileToThumb, validateImage } from '../lib/image.js';

export default function PhotoPicker({ photo, onChange, onBusyChange, onError }) {
  const cameraRef = useRef(null);
  const libraryRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow choosing the same file again
    if (!file) return;
    const problem = validateImage(file);
    if (problem) { onError(problem); return; }
    setBusy(true); onBusyChange(true);
    try { onChange(await fileToThumb(file)); onError(''); }
    catch (err) { onError(err.message); }
    finally { setBusy(false); onBusyChange(false); }
  };

  return (
    <div className="photopicker">
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={handle} tabIndex={-1} />
      <input ref={libraryRef} type="file" accept="image/*" hidden onChange={handle} tabIndex={-1} />
      {photo ? (
        <figure className="photo">
          <img src={photo} alt="Your photo, as it will be saved" />
        </figure>
      ) : (
        <div className="dropzone dropzone--static">
          <ImagePlus size={28} aria-hidden="true" />
          <strong>Add a photo</strong>
          <span>Optional. You can describe it instead.</span>
        </div>
      )}
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => cameraRef.current?.click()}><Camera size={18} aria-hidden="true" /> {photo ? 'Retake' : 'Take photo'}</button>
        <button type="button" className="btn btn--ghost" onClick={() => libraryRef.current?.click()}><ImagePlus size={18} aria-hidden="true" /> {photo ? 'Choose another' : 'Choose photo'}</button>
        {photo && <button type="button" className="btn btn--ghost" onClick={() => onChange(null)}><Trash2 size={18} aria-hidden="true" /> Remove</button>}
      </div>
      <p className="status" role="status">{busy ? 'Preparing your photo…' : photo ? 'Photo added.' : ''}</p>
    </div>
  );
}
