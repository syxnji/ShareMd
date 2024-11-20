'use client'
// component
import { Menu } from "@/components/Menu/page.jsx";
import { GroupHeadline } from "@/components/GroupHeadline/page.jsx";
import { PermissionCtrl } from "@/components/PermissionCtrl/page.jsx";
// style
import styles from "../Library/library.module.css";
import stylePermit from "./permission.module.css";
// icon
import { FaPlus } from "react-icons/fa6";
import { IoReturnDownBack } from "react-icons/io5";

export default function Permission() {
    
    // BackBtn
    const handleBack = () => {
        window.history.back(); // 前のページに戻る
    };

    // GroupHeadline
    const headLeft = (
        <div className={styles.auth}>
        </div>
    )
    const headRight =(
        <div className={styles.right}>
            <div className={stylePermit.backBtn}>
                <button onClick={handleBack}>
                    <IoReturnDownBack size={17}/>
                </button>
            </div>
        </div>
    )

    return(
        <>
            <main className={styles.main}>

                <Menu />

                <div className={styles.content}>
                    {/* headline */}
                    <GroupHeadline headLeft={headLeft} headRight={headRight} />

                    {/* permissions */}
                    <PermissionCtrl />
                    <PermissionCtrl />
                    <PermissionCtrl />

                    {/* add permission */}
                    <form action="" method="post">
                        <div className={stylePermit.addPermission}>
                            <div className={stylePermit.left}>
                                <div className={stylePermit.role}>
                                    <input type="text" placeholder="ロール名" />
                                </div>
                                <div className={stylePermit.permit}>
                                    <select name="" id="" className={stylePermit.select}>
                                        <option value="viewonly">閲覧のみ</option>
                                        <option value="editer">編集可能</option>
                                        <option value="all">全て</option>
                                    </select>
                                </div>
                            </div>
                            <div className={stylePermit.right}>
                                <div className={stylePermit.deleteBtn}>
                                    <button type="submit"><FaPlus /></button>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </main>
        </>
    )
}