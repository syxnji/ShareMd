import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
// style
import styles from "./permission.module.css"
// icon
import { FaMinus } from "react-icons/fa6";

export function PermissionCtrl({ id, name }) {
    
    // MARK:グループロール
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        const fetchPermissions = async () => {
            const response = await fetch(`/api/db?table=permissions`);
            const permissions = await response.json();
            setPermissions(permissions);
        };
        fetchPermissions();
    }, []);

    // TODO: グループごとにAIでオリジナルロールの生成
    // TODO: クリックでロール削除
    // TODO: Option変更で権限変更
    // TODO: 新しいロールのINSERT
    const deleteRole = (event) => {
        event.preventDefault();
        console.log('a');
    };

    return(
        <form action="" method="post">
            <div className={styles.permission}>
                <div className={styles.left}>
                    <div className={styles.role}>
                        <input type="text" placeholder="ロール名(変更)" value={name} readOnly/>
                    </div>
                    <div className={styles.permit}>
                        <select name="" id="" className={styles.select} value={id} defaultValue={id}>
                            {permissions.map((permission) => (
                                <option 
                                 key={permission.id}
                                 value={permission.id}
                                >
                                    {permission.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.deleteBtn}>
                        <ImgBtn img={<FaMinus/>} click={deleteRole} />
                    </div>
                </div>
            </div>
        </form>
    )
}