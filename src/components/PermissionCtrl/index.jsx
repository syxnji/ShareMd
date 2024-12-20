import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
import { ModalWindow } from "@/components/ModalWindow";
// style
import styles from "./permission.module.css";
// icon
import { FaMinus } from "react-icons/fa6";

export function PermissionCtrl({ roleId, roleName, permissionId, updateData }) {
    const [permissions, setPermissions] = useState([]);
    const [modalState, setModalState] = useState({ open: false, type: null });
    const [valueSelect, setValueSelect] = useState(roleId);

    // 権限データの取得
    useEffect(() => {
        const fetchPermissions = async () => {
            const response = await fetch(`/api/db?table=permissions`);
            const permissions = await response.json();
            setPermissions(permissions);
        };
        fetchPermissions();
    }, [roleId]);

    // セレクト内オプションのトグル処理
    const handleChangeOption = (event) => {
        setValueSelect(event.target.value);
        setModalState({ open: true, type: "update" });
    };

    // 削除ボタンクリック処理
    const handleDeleteRole = () => {
        setModalState({ open: true, type: "delete" });
    };

    // モーダルボタン「YES」のアクション
    const handleModalAction = async (confirm) => {
        if (confirm) {
            if (modalState.type === "update") {
                await fetch(`/api/db?table=updPermission&id=${roleId}&new=${valueSelect}`);
                updateData();
            } else if (modalState.type === "delete") {
                await fetch(`/api/db?table=deleteRole&id=${roleId}`);
                updateData();
            }
        }
        setModalState({ open: false, type: null });
    };

    // 選択前:id, 選択後:valueSelect のIDから権限名を取得
    const getName = (id) => (
        permissions.find((permission) => permission.id === parseInt(id)) || {}
    ).name || '';

    const beforeName = getName(roleId);
    const afterName = getName(valueSelect);

    return (
        <>  
        {/* モーダル */}
        {modalState.open && (
        <ModalWindow 
            msg={modalState.type === "update" ? '本当に変更しますか？' : '本当に削除しますか？'}
            name={roleName} 
            before={modalState.type === "update" ? beforeName : null}
            after={modalState.type === "update" ? afterName : null} 
            No={() => setModalState({ open: false, type: null })}
            Yes={() => handleModalAction(true)}
        />
        )}

        <div className={styles.permission}>
            <div className={styles.left}>
                <div className={styles.role}>
                    <input 
                     type="text" 
                     placeholder="ロール名(変更)" 
                     value={roleName} 
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
                    <ImgBtn img={<FaMinus />} click={handleDeleteRole} />
                </div>
            </div>
        </div>
        </>
    );
}