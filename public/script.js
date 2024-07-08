document.getElementById('result')?.addEventListener('click', async (event) => {
    await navigator.clipboard.writeText(event.target.value)
    alert('copied')
})