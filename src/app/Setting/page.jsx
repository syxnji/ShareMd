// style
import styles from "./setting.module.css"

export default function Setting() {
    return(
        <main>
            <div className={styles.settings}>
                <div className={styles.profile}>
                    <form action="" method="post" className={styles.form}>
                        <figure className={styles.figure}></figure>
                        <input type="text" placeholder="ユーザー名"/>
                        <input type="text" placeholder="メールアドレス"/>
                        <button type="submit">ログアウト</button>
                    </form>
                </div>
                <div className={styles.groups}>
                    <div className={styles.head}>
                        <p>Joined Groups</p>
                    </div>
                    <div className={styles.groups}>
                        <div className={styles.group}>
                            <div className={styles.left}>
                                <p className={styles.groupName}>This is group</p>
                                <p className={styles.groupSize}>3 人</p>
                            </div>
                            <div className={styles.right}>
                                <button>
                                    -
                                </button>
                            </div>
                        </div>
                        <div className={styles.group}>
                            <div className={styles.left}>
                                <p className={styles.groupName}>This is group</p>
                                <p className={styles.groupSize}>3 人</p>
                            </div>
                            <div className={styles.right}>
                                <button>
                                    -
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}