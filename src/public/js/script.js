const fileBtn = document.getElementById('addFileButton'); 
const folderBtn = document.getElementById('addFolderButton');
const fileForm = document.getElementById('file-upload-form');
const folderForm = document.getElementById('folder-upload-form');
const fileCancelBtn = document.getElementById('fileFormCancel');
const folderCancelBtn = document.getElementById('folderFormCancel');

fileBtn.addEventListener('click', (e)=>{
    e.target.classList.toggle('hidden');
    folderBtn.classList.toggle('hidden');
    fileForm.classList.toggle('hidden');
})

folderBtn.addEventListener('click', (e)=>{
    e.target.classList.toggle('hidden');
    fileBtn.classList.toggle('hidden');
    folderForm.classList.toggle('hidden');
})

 fileCancelBtn.addEventListener('click', ()=>{
    fileForm.classList.toggle('hidden');
    fileBtn.classList.toggle('hidden');
    folderBtn.classList.toggle('hidden');
 })
 
 folderCancelBtn.addEventListener('click', ()=>{
    folderForm.classList.toggle('hidden');
    fileBtn.classList.toggle('hidden');
    folderBtn.classList.toggle('hidden');
 })