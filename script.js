const state = {
    body: null,
    textWidth: 0,
    textHeight: 0,
    maxHorizontalChars: 0,
    maxVerticalChars: 0,
}

const b = {
    lb: '\n',
    sp: ' ',
    fb: '█',
    hs: '─',
    hd: '╌',
    vs: '│',
    vd: '╎',
    lu: '┌',
    ld: '└',
    ru: '┐',
    rd: '┘',
    lt: '├',
    rt: '┤',
    ut: '┬',
    dt: '┴',
    cr: '┼',
};

function init() {
    const body = document.querySelector('body');
    // get text size
    const span = document.createElement('span');
    span.innerHTML = "█";
    body.appendChild(span);
    state.textWidth = span.getBoundingClientRect().width;
    state.textHeight = span.getBoundingClientRect().height;
    body.removeChild(span);
    // bind body to globe
    state.body = body;
    window.addEventListener('resize', drawPage);
    drawPage()
}

function drawPage() {
    state.body.innerHTML = setBody(window.innerWidth, window.innerHeight, state.textWidth, state.textHeight)
}

function createLine(start, end, fill, ...content) {
    let combLength = String(start).length+String(end).length+content.join('').replace(/&\w+;/gi, '@').length;
    return ''+start+content.join('')+fill.repeat(state.maxHorizontalChars-combLength)+end;
}

function getHeader() {
    let headerLines = [];
    headerLines.push(createLine(b.lu, b.ru, b.hs));
    title = window.atob(
        "IF9fXyAgICBfX18gICBfLHwgICBcICAvICAgfCB8X3wsfCB8XCBcLyAvfCB8ICBfICAgX1\
        9fICAgX19fX18gICBfX19fXyx8IHwgXF9fLyB8IHwgfCB8IHwgIF98IHwgIF8gIHwgfCAgX\
        yAgfCx8IHwgICAgICB8IHwgfCB8IHwgfCAgIHwgfF98IHwgfCB8IHwgfCx8X3wgICAgICB8X\
        3wgfF98IHxffCAgIHxfX19fX3wgfF98IHxffCw=");
    for (let line of title.split(",")) {
        headerLines.push(createLine(b.vs, b.vs, b.sp, " ", line, " "));
    }
    headerLines.push(createLine(b.lt, b.rt, b.hs));
    return headerLines;
}

function getFooter() {
    let footerLines = []
    footerLines.push(createLine(b.lt, b.rt, b.hs));
    footerLines.push(createLine(b.vs, b.vs, b.sp, ' &copy; 2020 Miron Gertis'))
    footerLines.push(createLine(b.ld, b.rd, b.hs))
    return footerLines;
}

function setBody(windowWidth, windowHeight, textWidth, textHeight) {
    state.maxHorizontalChars = Math.floor(windowWidth / textWidth);
    state.maxVerticalChars = Math.floor(windowHeight / textHeight);
    let headerLines = getHeader()
    let fillerLines = []
    let footerLines = getFooter()
    let usedLines = headerLines.length + footerLines.length;
    for (let i = 0; i < state.maxVerticalChars-usedLines; i++) {
        fillerLines.push(createLine(b.vs, b.vs, b.sp))
    }
    let lines = headerLines.concat(fillerLines, footerLines)
    return "<pre>"+lines.join("\n")+"</pre>"
}