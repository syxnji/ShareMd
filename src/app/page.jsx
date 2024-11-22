// style
import styles from "@/styles/index.module.css"

export default function MarkdownEditor() {
  // 仮データ
  const bookColors = [
    '#8B4513', // Saddle Brown
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#DEB887', // Burlywood
    '#F4A460', // Sandy Brown
    '#D2B48C', // Tan
    '#FFDAB9', // Peach Puff
    '#FFE4B5', // Moccasin
    '#F0E68C', // Khaki
    '#BDB76B', // Dark Khaki
    '#800000', // Maroon
    '#8B0000', // Dark Red
    '#A52A2A', // Brown
    '#B22222', // Fire Brick
    '#CD5C5C', // Indian Red
  ]
  const booksTop = Array.from({ length: 51 }, () => bookColors[Math.floor(Math.random() * bookColors.length)])
  const booksBottom = Array.from({ length: 51 }, () => bookColors[Math.floor(Math.random() * bookColors.length)])
  return (
      <main>
        <div className={styles.contents}>
          <div className={styles.bookshelf}>
            {booksTop.map((color, index) => (
              <div
              className={styles.book}
              key={index}
              style={{
                backgroundColor: color
              }}
              />
            ))}
          </div>
          <div className={styles.middle}>
            <p className={styles.siteName}>
              {/* ShereText */}
              <span>S</span>
              <span>h</span>
              <span>e</span>
              <span>r</span>
              <span>e</span>
              <span>T</span>
              <span>e</span>
              <span>x</span>
              <span>t</span>
            </p>
            <form action="" method="post">
              <label htmlFor="title">Note Title</label>
              <input type="text" id="title"/>
              <button>New Note</button>
            </form>
          </div>
          <div className={styles.bottom}>
            <div className={styles.trapezoid}>a</div>
            <div className={styles.bookshelf}>
              {booksBottom.map((color, index) => (
                <div
                className={styles.book}
                key={index}
                style={{
                  backgroundColor: color
                }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
  )
}