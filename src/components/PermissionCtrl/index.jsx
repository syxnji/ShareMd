import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
// style
import styles from "./permission.module.css"
// icon
import { FaMinus } from "react-icons/fa6";
import { BsCaretRightFill } from "react-icons/bs";

export function PermissionCtrl({ id, permissionName, permissionId, permissionUpdate }) {
    
    // MARK:グループロール
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        const fetchPermissions = async () => {
            const response = await fetch(`/api/db?table=permissions`);
            const permissions = await response.json();
            setPermissions(permissions);
        };
        fetchPermissions();
    }, [id]);

    // TODO: グループごとにAIでオリジナルロールの生成
    // TODO: クリックでロール削除
    // TODO: Option変更で権限変更
    // TODO: 新しいロールのINSERT

    // セレクトのオプション切替
    const [valueSelect, setValueSelect] = useState(id)
    const handleChangeOption = (event) => {
        setOpenModal(true);
        setValueSelect(event.target.value);
    };
    
    // モーダル YES/NO
    const [openModal,setOpenModal] = useState(false)
    const handleModalNo = () => {
        setOpenModal(false);
    };
    const handleModalYes = async () => {
        await fetch(`/api/db?table=updPermission&id=${id}&new=${valueSelect}`);
        setOpenModal(false);
        permissionUpdate();
    };

    // 選択前:id, 選択後:valueSelect のIDから権限名を取得
    const getName = id => (
        permissions.find(
            permission => permission.id === parseInt(id)
        ) || {}).name || '';
    const beforeName = getName(id);
    const afterName = getName(valueSelect);

    return(
        <>  
        {openModal && (
            <div className={styles.modal}>
                <p className={styles.message}>本当に変更しますか？</p>
                <div className={styles.modalRole}>{permissionName}</div>
                <div className={styles.changes}>
                    <p className={styles.change}>
                        {beforeName}
                    </p>
                    <BsCaretRightFill />
                    <p className={styles.change}>
                        {afterName}
                    </p>
                </div>
                <div className={styles.modalBtns}>
                    <button 
                     className={styles.modalNo} 
                     onClick={handleModalNo}
                    >いいえ</button>
                    <button 
                     className={styles.modalYes} 
                     onClick={handleModalYes}
                    >はい</button>
                </div>
            </div>
        )}
        {/* <form action="" method="post"> */}
        <div className={styles.permission}>
            <div className={styles.left}>
                <div className={styles.role}>
                    <input 
                     type="text" 
                     placeholder="ロール名(変更)" 
                     value={permissionName} 
                     readOnly
                    />
                </div>
                <div className={styles.permit}>
                    <select 
                     className={styles.select} 
                     value={permissionId}
                     onChange={handleChangeOption}
                    >
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
                    <ImgBtn img={<FaMinus/>} />
                </div>
            </div>
        </div>
        {/* </form> */}
          
        </>
    )
}