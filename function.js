async function downloadCV() {
    // Chemin vers ton fichier (met le nom exact du fichier tel qu'il est sur le serveur)
    const filePath = './image/Cv%20Samuel%20Galliani-Royer-4.pdf';
    const fileName = 'Samuel_Galliani-Royer_CV.pdf';

    // Fallback simple si fetch n'est pas disponible
    function fallbackDownload() {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = filePath;
        a.download = fileName;
        document.body.appendChild(a); // important pour compatibilité (Firefox)
        a.click();
        document.body.removeChild(a);
    }

    // Utilise fetch + blob pour forcer le téléchargement (meilleur comportement cross-browser)
    if (window.fetch) {
        try {
            const response = await fetch(filePath, { cache: 'no-cache' });
            if (!response.ok) throw new Error('Erreur réseau: ' + response.status);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // nettoyage (on attend un court instant pour être sûr que le navigateur a démarré le download)
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 1000);
        } catch (err) {
            console.error('Téléchargement via fetch échoué :', err);
            // Essaye le fallback simple (clic sur ancre)
            try { fallbackDownload(); }
            catch (e) {
                console.error('Fallback échoué :', e);
                alert("Impossible de télécharger le CV. Vérifie le chemin du fichier dans la console (F12).");
            }
        }
    } else {
        // Pas de fetch -> fallback
        fallbackDownload();
    }
}