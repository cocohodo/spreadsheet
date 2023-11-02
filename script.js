const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportButton = document.querySelector('#export-button');
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

class Cell {
    constructor(isHeader,disabled,data,row,column,rowName,columnName,active=false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.rowName = rowName;
        this.column = column;
        this.columnName = columnName;
        this.active = active;
    }
}
exportButton.onclick = function(e) {
    let csv = "";
    for(let i = 0; i < spreadsheet.length; i++) {
        if(i===0) continue;
        csv += spreadsheet[i]
            .filter(item => !item.isHeader)
            .map(item => item.data)
            .join(',') + "\r\n";
    }
    console.log(csv);

    const csvObject = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObject);
    console.log('csvUrl',csvUrl);

    const a = document.createElement('a');
    a.href =  csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

function initSpreadsheet() {
    for(let i = 0; i < COLS; i++) {
        let spreadsheetRow = [];
        for(let j = 0; j < ROWS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            //모든 row 첫 번째 column에 숫자 넣기
            if(j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }
            if(i === 0) {
                cellData = alphabets[j-1];
                isHeader = true;
                disabled = true;
            }
            //첫 번째 row의 컬럼은 ""
            if(!cellData) {
                cellData = "";
            }
            const rowName = i;
            const columnName = alphabets[j-1];
            const cell = new Cell(isHeader,disabled,cellData,i,j,rowName,columnName,false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    // console.log(spreadsheet);
}
initSpreadsheet();

function createCellElement(cell) {
    const cellElement = document.createElement('input');
    cellElement.className = 'cell';
    cellElement.id = 'cell_' + cell.row + cell.column;
    cellElement.value = cell.data;
    cellElement.disabled = cell.disabled;
    if(cell.isHeader) {
        cellElement.classList.add('header');
    }

    cellElement.onclick = () => handleCellClick(cell);
    cellElement.onchange = (e) => handleOnChange(e.target.value,cell);

    return cellElement;
}

function handleOnChange(data,cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderElement = getElementFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderElement = getElementFromRowCol(rowHeader.row, rowHeader.column);
    clearHeaderActiveStates();
    columnHeaderElement.classList.add('active');
    rowHeaderElement.classList.add('active');
    document.querySelector("#cell-status").innerHTML = cell.columnName+cell.rowName;
    // console.log('clicked cell',columnHeaderElement,rowHeaderElement);
}
function clearHeaderActiveStates() {
    const headers = document.querySelectorAll('.header');
    headers.forEach(header => {
        header.classList.remove('active');
    });
}

function getElementFromRowCol(row,col) {
    return document.querySelector('#cell_' + row + col);
}

function drawSheet() {
    for(let i = 0; i < spreadsheet.length; i++) {
        const rowContainerElement = document.createElement('div');
        rowContainerElement.className = 'cell-row';
        for(let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerElement.append(createCellElement(cell));
        }
        spreadSheetContainer.append(rowContainerElement);
    }
}

