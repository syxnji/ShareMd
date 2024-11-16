import { Menu } from "../../components/Menu/page.jsx";
import { Notes } from "../../components/SelectNote/page.jsx";
import { BsGrid3X3 } from "react-icons/bs";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import styles from "./library.module.css";


export default function Library() {
    return(
        <>
            <main className={styles.main}>

                <Menu />

                <div className={styles.content}>
                    {/* head */}
                    <div className={styles.outerHead}>
                        <div className={styles.innerHead}>
                            <div className={styles.left}>
                                <p className={styles.title}>
                                    Category Name
                                </p>
                            </div>
                            <div className={styles.right}>
                                <div className={styles.layouts}>
                                    <button><BsGrid3X3 /></button>
                                    <button><BsList /></button>
                                </div>
                                <div className={styles.addNote}>
                                    <button><BsFileEarmarkPlus /> <span>New Note</span></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* search */}
                    <div className={styles.search}>
                        <form action="">
                            <input placeholder="Note name ..." type="search" name="" id="" />
                            <button type="submit"><BsSearch /></button>
                        </form>
                    </div>

                    {/* notes */}
                    <div className={styles.notes}>
                        <Notes />
                        <Notes />
                        <Notes />
                        <Notes />
                        <Notes />
                    </div>
                </div>
            </main>
        </>
    )
}