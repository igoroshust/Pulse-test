window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        const dataTable = new simpleDatatables.DataTable(datatablesSimple);

        // Изменение текста в ячейках
        const rows = datatablesSimple.querySelector('.datatable-info');
    }
});