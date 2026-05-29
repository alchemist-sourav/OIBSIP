const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client', 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace "http://localhost:5000/..." with `${process.env.REACT_APP_API_URL}/...`
    content = content.replace(/"http:\/\/localhost:5000\/([^"]*)"/g, '`${process.env.REACT_APP_API_URL}/$1`');
    
    // Replace `http://localhost:5000/...` (already template literals) with `${process.env.REACT_APP_API_URL}/...`
    content = content.replace(/`http:\/\/localhost:5000\/([^`]*)`/g, '`${process.env.REACT_APP_API_URL}/$1`');
    
    // Replace io("http://localhost:5000")
    content = content.replace(/io\("http:\/\/localhost:5000"\)/g, 'io(process.env.REACT_APP_API_URL)');
    
    fs.writeFileSync(p, content, 'utf8');
});
console.log('Replaced localhost:5000 in client files');
