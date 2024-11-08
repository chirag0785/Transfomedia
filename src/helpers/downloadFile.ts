type DownloadProps = {
    url: string,
    title: string,
    typeOfTransformation?: string,
    aspectRatio?: string,
    fileExtension?: string
}
export const downloadFile = ({url, title, typeOfTransformation='', aspectRatio='',fileExtension='png'}: DownloadProps) => {
    fetch(url) //fetches buffer response
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${title.replace(/\s+/g, '-').toLowerCase()}_${typeOfTransformation}${aspectRatio ? `_${aspectRatio}` : ''}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
}