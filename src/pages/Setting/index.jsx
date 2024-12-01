'use client'
// component
import { JoinedGroup } from "@/components/JoinedGroup/index.jsx";
import { MainBtn } from "@/components/UI/MainBtn";
import { GroupHeadline } from "@/components/GroupHeadline";
import { ImgBtn } from "@/components/UI/ImgBtn";
// style
import styles from "./setting.module.css"
// icon
import { IoReturnDownBack, IoSaveOutline } from "react-icons/io5";

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

    // MARK:GroupHeadline
    // left
    const headLeftProfile = (
        <p className={styles.headTitle}>Profile</p>
    )
    const headLeftGroup = (
        <p className={styles.headTitle}>Joined Groups</p>
    )
    
    // BackBtn
    const handleBack = () => {
        window.history.back();
    };
    const headRight =(
        <div className={styles.backBtn}>
            <ImgBtn img={<IoReturnDownBack/>} click={handleBack} />
        </div>
    )

    return(
        <main>
            <div className={styles.settings}>
                <div className={styles.profile}>
                    <GroupHeadline headLeft={headLeftProfile}/>
                    <form action="" method="post" className={styles.form}>
                        <figure className={styles.figure}></figure>
                        <input type="text" placeholder="ユーザー名"/>
                        <input type="text" placeholder="メールアドレス"/>
                        <button type="submit">ログアウト</button>
                    </form>
                </div>
                <div className={styles.groupContent}>
                    <GroupHeadline headLeft={headLeftGroup} headRight={headRight}/>
                    <div className={styles.groups}>
                        {groups.map((group) => (
                            <JoinedGroup 
                                key={group.id}
                                group={group.group}
                                member={group.member}
                            />
                        ))}
                    </div>
                    <div className={styles.saveBtn}>
                        <MainBtn img={<IoSaveOutline/>} text="Save"/>
                    </div>
                </div>
            </div>
        </main>
    )
}