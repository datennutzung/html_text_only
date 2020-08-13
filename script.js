class MyElement {
    constructor (tag, html, inner) {
        this.tag = tag;
        this.inner = inner;
        this.html = html;
        this.length = inner.length
    }
    
    toString = function() {
        return "<"+this.tag+" "+this.html+">"+this.inner+"</"+this.tag+">";
    }
}

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
    function countContent (content) {
        let i = 0
        for (let c of content) {
            if (typeof c == typeof "string") {
                i += c.replace(/&\w+;/gi, '@').length;
            } else {
                i += c.length;
            }
        }
        return i
    }
    let combLength = String(start).length+String(end).length+countContent(content);
    return ''+start+content.join("")+fill.repeat(state.maxHorizontalChars-combLength)+end;
}

function getHeader() {
    let headerLines = [];
    headerLines.push(createLine(b.lu, b.ru, b.hs));
    title = window.atob(
        `IF9fXyAgICBfX18gICBfLHwgICBcICAvICAgfCB8X3wsfCB8XCBcLyAvfCB8ICBfICAgX1
        9fICAgX19fX18gICBfX19fXyx8IHwgXF9fLyB8IHwgfCB8IHwgIF98IHwgIF8gIHwgfCAgX
        yAgfCx8IHwgICAgICB8IHwgfCB8IHwgfCAgIHwgfF98IHwgfCB8IHwgfCx8X3wgICAgICB8X
        3wgfF98IHxffCAgIHxfX19fX3wgfF98IHxffCw=`);
    for (let line of title.split(',')) {
        headerLines.push(createLine(b.vs, b.vs, b.sp, " ", line, " "));
    }
    headerLines.push(createLine(b.lt, b.rt, b.hs));
    return headerLines;
}

function getLongText(text) {
    let textBlock = [];

}

function getMotD() {

}

function getFooter() {
    let footerLines = []
    footerLines.push(createLine(b.lt, b.rt, b.hs));
    let websiteLink = new MyElement('a', 'href="https://datennutzung.github.io"', 'Website')
    let githubLink = new MyElement('a', 'href="https://github.com/datennutzung/"', 'GitHub')
    let twitterLink = new MyElement('a', 'href="https://twitter.com/datennutzung/"', 'Twitter')
    let emailLink = new MyElement('a', 'href="mailto://miron@gertis.de"', 'Email')
    let telegramLink = new MyElement('a', 'href="https://t.me/MironGertis"', 'Telegram')
    footerLines.push(createLine(b.vs, b.vs, b.sp,
        " ", websiteLink,
        " ", githubLink,
        " ", twitterLink,
        " ", emailLink,
        " ", telegramLink));
    footerLines.push(createLine(b.vs, b.vs, b.sp, ' &copy; 2020 Miron Gertis'));
    footerLines.push(createLine(b.ld, b.rd, b.hs));
    return footerLines;
}


function setBody(windowWidth, windowHeight, textWidth, textHeight) {
    state.maxHorizontalChars = Math.floor(windowWidth / textWidth);
    state.maxVerticalChars = Math.floor(windowHeight / textHeight);

    let headerLines = getHeader()
    let body = []
    let fillerLines = []
    let footerLines = getFooter()
    let usedLines = headerLines.length + body.length + footerLines.length;
    for (let i = 0; i < state.maxVerticalChars-usedLines; i++) {
        fillerLines.push(createLine(b.vs, b.vs, b.sp))
    }
    let lines = headerLines.concat(fillerLines, footerLines)
    return "<pre>"+lines.join("\n")+"</pre>"
}