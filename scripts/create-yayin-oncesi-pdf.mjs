import { writeFileSync } from "node:fs";

const outputPath = new URL("../docs/yayin-oncesi-olmasi-gerekenler.pdf", import.meta.url);

const title = "Yayin Oncesi Olmasi Gerekenler";
const sections = [
  {
    heading: "Amac",
    lines: [
      "Bu dokuman, bunediyola yayina cikmadan once tamamlanmasi gereken kritik urun, guvenlik ve kullanici deneyimi maddelerini kalici olarak not etmek icin hazirlandi.",
      "Amac hizli yayina cikmak degil; kullanici gibi dusunup eksik, guvensiz veya yarim hissettiren alanlari yayindan once yakalamaktir.",
    ],
  },
  {
    heading: "Kesinlikle Yayinlamadan Once",
    lines: [
      "1. Sikayet ve Moderasyon Sistemi",
      "- Bu asama tamamlanmadan yayin yapilmamali.",
      "- Icerik bildirimi ve yorum bildirimi birbirinden ayri calismali.",
      "- Kullanici bir yorumu bildirdiyse, ayni yazinin kendisini de ayrica bildirebilmeli.",
      "- Kullanici ayni yorumu tekrar tekrar bildirememeli.",
      "- Kullanici ayni icerigi tekrar tekrar bildirememeli.",
      "- Sikayet gondermek icin giris gerekiyorsa, kullanici sayfadan kopmadan giris modaliyla devam edebilmeli.",
      "- Giris yaptiktan sonra kullanici ayni icerikte kalip sikayet formunu tamamlayabilmeli.",
      "- Basarili sikayet sonrasi kullanici net bir onay mesaji gormeli.",
      "- Admin panelde bekleyen sikayet sayisi gorunmeli.",
      "- Admin sikayetleri filtreleyebilmeli: bekleyen, incelendi, reddedildi, islem yapildi.",
      "- Admin bildirilen yaziya veya yoruma kolayca ulasabilmeli.",
      "- Yeni sikayet geldiginde admin bildirimi olusmali.",
      "Onemli not: Yorum bildirimi ile icerik bildirimi ayni sey degildir. Bir yorum sorunlu olabilir ama yazinin kendisi sorunlu olmayabilir; tam tersi de olabilir. Bu yuzden sistem bu iki bildirimi ayri haklar ve ayri kayitlar olarak ele almali.",
      "2. Kullanici Guven Akisi",
      "- Giris, kayit, sifre sifirlama ve cikis akislari kirik olmamali.",
      "- Giris yapmamis kullanici yorum, begeni, kaydetme veya bildirme gibi aksiyonlarda sayfadan kopmamali.",
      "- Hata mesajlari kullaniciya ne yapmasi gerektigini acik soylemeli.",
      "- Basarili islemlerden sonra kullaniciya guven veren kisa geri bildirim gosterilmeli.",
      "- Kullanici kendi profil, yorum, begeni ve kayitli icerik alanlarina sorunsuz erisebilmeli.",
      "3. Admin Kontrolu",
      "- Admin icerik olusturma, duzenleme, taslak/yayin durumu degistirme akislarini sorunsuz kullanabilmeli.",
      "- Admin kategori yonetimini sorunsuz kullanabilmeli.",
      "- Admin yorumlari gizleyebilmeli veya yonetebilmeli.",
      "- Admin bildirimleri okunmus yapabilmeli ve silebilmeli.",
      "- Admin panelde temel sayilar dogru gorunmeli.",
      "- Admin olmayan kullanici admin paneline girememeli.",
      "4. Temel Yayin Kalitesi",
      "- Mobil gorunum temiz olmali.",
      "- Header, menu, arama, footer ve icerik detay sayfalari tasma yapmamali.",
      "- Icerik kartlari ve detay sayfalari kullaniciya yarim kalmis hissi vermemeli.",
      "- Bos durumlar duzgun gorunmeli: hic yorum yok, hic kayitli icerik yok, arama sonucu yok gibi.",
      "- npm run lint basarili olmali.",
      "- npm run build basarili olmali.",
    ],
  },
  {
    heading: "Oncelikli Ama Yayin Bloklamayabilir",
    lines: [
      "- Daha guclu kategori menusu.",
      "- Gundem veya guncel konular satiri.",
      "- Populer/trend icerikler alaninin daha gorunur olmasi.",
      "- Genel Gorus Bildir butonu.",
      "- Ana sayfada one cikan icerik alani.",
      "- Icerik kesfini artiracak benzer icerikler ve okumaya devam et alanlarinin guclendirilmesi.",
    ],
  },
  {
    heading: "Simdilik Ertelenebilir",
    lines: [
      "- Dolar, euro, altin, borsa, kripto seridi.",
      "- Buyuk mega menu.",
      "- Manset slider sistemi.",
      "- Test, quiz veya anket altyapisi.",
      "- Cok gelismis kisilestirme.",
      "- Push bildirimleri.",
      "- Mobil uygulama.",
    ],
  },
  {
    heading: "Urun Karari",
    lines: [
      "1. v3.10 sikayet/moderasyon sistemini saglamlastir.",
      "2. Icerik bildirimi ve yorum bildirimi ayrimini kesin duzelt.",
      "3. Admin sikayet yonetimini test et.",
      "4. Sonra yayin oncesi kullanici deneyimi kontrolune gec.",
      "Kisa karar: Sikayet ve moderasyon sistemi saglam olmadan yayinlama.",
    ],
  },
];

const page = {
  width: 595.28,
  height: 841.89,
  marginX: 54,
  marginTop: 64,
  marginBottom: 58,
};

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLine(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function addText(commands, text, x, y, size, font = "F1") {
  commands.push("BT");
  commands.push(`/${font} ${size} Tf`);
  commands.push(`${x.toFixed(2)} ${y.toFixed(2)} Td`);
  commands.push(`(${escapePdfText(text)}) Tj`);
  commands.push("ET");
}

const pages = [];
let commands = [];
let y = page.height - page.marginTop;

function newPage() {
  if (commands.length) {
    pages.push(commands.join("\n"));
  }
  commands = [];
  y = page.height - page.marginTop;
}

function ensureSpace(height) {
  if (y - height < page.marginBottom) {
    newPage();
  }
}

addText(commands, title, page.marginX, y, 24, "F2");
y -= 28;
addText(commands, "bunediyola urun notu", page.marginX, y, 10);
y -= 22;

for (const section of sections) {
  ensureSpace(34);
  y -= 10;
  addText(commands, section.heading, page.marginX, y, 16, "F2");
  y -= 20;

  for (const line of section.lines) {
    const isSubHeading = /^\d+\./.test(line);
    const wrapped = wrapLine(line, isSubHeading ? 70 : 86);
    ensureSpace(wrapped.length * 14 + 6);

    for (const wrappedLine of wrapped) {
      addText(commands, wrappedLine, page.marginX + (line.startsWith("-") ? 12 : 0), y, isSubHeading ? 12.5 : 10.5, isSubHeading ? "F2" : "F1");
      y -= isSubHeading ? 16 : 13.5;
    }

    y -= isSubHeading ? 2 : 1;
  }
}

newPage();

const objects = [];
function addObject(body) {
  objects.push(body);
  return objects.length;
}

const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
const pagesId = addObject("");
const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

const pageIds = [];
for (const content of pages) {
  const stream = `${content}\n`;
  const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}endstream`);
  const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`);
  pageIds.push(pageId);
}

objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

let pdf = "%PDF-1.4\n";
const offsets = [0];

for (let i = 0; i < objects.length; i += 1) {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdf, "latin1");
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let i = 1; i < offsets.length; i += 1) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

writeFileSync(outputPath, Buffer.from(pdf, "latin1"));
console.log(`PDF created: ${outputPath.pathname}`);
