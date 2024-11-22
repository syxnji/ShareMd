import { JoinedGroup } from "@/components/JoinedGroup/page.jsx";
// style
import styles from "./setting.module.css"

export default function Setting() {
    // TODO:仮データ
    const groups = [
        { id: 1, group: 'Marketing Team', member: 12 },
        { id: 2, group: 'Development Team', member: 25 },
        { id: 3, group: 'Design Group', member: 8 },
        { id: 4, group: 'Human Resources', member: 10 },
        { id: 5, group: 'Sales Division', member: 18 },
        { id: 6, group: 'Customer Support', member: 15 },
        { id: 7, group: 'Research and Innovation', member: 7 },
        { id: 8, group: 'Product Management', member: 9 },
        { id: 9, group: 'Finance and Accounting', member: 11 },
        { id: 10, group: 'Logistics and Supply Chain', member: 14 }
    ];

    return(
        <main>
            <div className={styles.settings}>
                <div className={styles.profile}>
                    <div className={styles.profileHead}>
                        <p>Profile</p>
                    </div>
                    <form action="" method="post" className={styles.form}>
                        <figure className={styles.figure}></figure>
                        <input type="text" placeholder="ユーザー名"/>
                        <input type="text" placeholder="メールアドレス"/>
                        <button type="submit">ログアウト</button>
                    </form>
                </div>
                <div className={styles.groups}>
                    <div className={styles.groupHead}>
                        <p>Joined Groups</p>
                    </div>
                    <div className={styles.groups}>
                        {groups.map((group) => (
                            <JoinedGroup 
                                id={group.id}
                                group={group.group}
                                member={group.member}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}