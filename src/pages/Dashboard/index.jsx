"use client"
import { useState, useEffect } from 'react';
// style
import styles from './dashboard.module.css';
// icon
import { LuUsersRound } from "react-icons/lu";
import { FaObjectUngroup } from "react-icons/fa6";
import { RiShieldUserFill } from "react-icons/ri";
import { PiNote } from "react-icons/pi";
import { MdDelete, MdOutlineRestore } from "react-icons/md";
// component
import { AdminHeader } from '@/components/AdminHeader';
import { AdminUserInfo } from '@/components/Modals/AdminUserInfo';

export default function Dashboard() {
    const [active, setActive] = useState("dashboard");

    // MARK: Dashboard
    const [usersCount, setUsersCount] = useState(0);
    const [groupsCount, setGroupsCount] = useState(0);
    const [rolesCount, setRolesCount] = useState(0);
    const [notesCount, setNotesCount] = useState(0);
    const fetchDashboard = async () => {
        const response = await fetch(`/api/db?table=dashboard`);
        const dashboard = await response.json();
        setUsersCount(dashboard.results[0].users_count);
        setGroupsCount(dashboard.results[0].groups_count);
        setRolesCount(dashboard.results[0].roles_count);
        setNotesCount(dashboard.results[0].notes_count);
    }

    // MARK: Users
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const fetchUsers = async () => {
        const resUsers = await fetch(`/api/db?table=management_users`);
        const retUsers = await resUsers.json();
        setUsers(retUsers.results);
    }
    const filteredUsers = users.filter((user) => {
        return user.username.includes(search);
    });
    // MARK: ユーザークリック
    const [modalUser, setModalUser] = useState(false);
    const toggleModalAdminUserInfo = () => {
        setModalUser(!modalUser);
    }
    const [selectedUserInfo, setSelectedUserInfo] = useState([]);
    const handleUserClick = async (id) => {
        const selectedUserId = id;
        const resSelectUser = await fetch(`/api/db?table=admin_selectUser&userId=${selectedUserId}`);
        const retSelectUser = await resSelectUser.json();
        setSelectedUserInfo(retSelectUser.results);
        setModalUser(true);
    }
    // MARK: ユーザー削除
    const handleDeleteUser = async (id) => {
        await fetch(`/api/db?table=deleteUser&id=${id}`);
        fetchUsers();
    }
    // MARK: ユーザー復元
    const handleRestoreUser = async (id) => {
        await fetch(`/api/db?table=restoreUser&id=${id}`);
        fetchUsers();
    }

    // MARK: Groups
    const [groups, setGroups] = useState([]);
    const fetchGroups = async () => {
        const resGroups = await fetch(`/api/db?table=management_groups`);
        const retGroups = await resGroups.json();
        setGroups(retGroups.results);
    }
    const filteredGroups = groups.filter((group) => {
        return group.name.includes(search);
    });
    // MARK: グループ削除
    const handleDeleteGroup = async (id) => {
        await fetch(`/api/db?table=deleteGroup&id=${id}`);
        fetchGroups();
    }
    // MARK: グループ復元
    const handleRestoreGroup = async (id) => {
        await fetch(`/api/db?table=restoreGroup&id=${id}`);
        fetchGroups();
    }

    // MARK: Roles
    const [roles, setRoles] = useState([]);
    const fetchRoles = async () => {
        const resRoles = await fetch(`/api/db?table=management_roles`);
        const retRoles = await resRoles.json();
        setRoles(retRoles.results);
    }
    const filteredRoles = roles.filter((role) => {
        return role.name.includes(search);
    });
    // MARK: ロール削除
    const handleDeleteRole = async (id) => {
        await fetch(`/api/db?table=deleteRole&roleId=${id}`);
        fetchRoles();
    }
    // MARK: ロール復元
    const handleRestoreRole = async (id) => {
        await fetch(`/api/db?table=restoreRole&id=${id}`);
        fetchRoles();
    }

    // MARK: Notes
    const [notes, setNotes] = useState([]);
    const fetchNotes = async () => {
        const resNotes = await fetch(`/api/db?table=management_notes`);
        const retNotes = await resNotes.json();
        setNotes(retNotes.results);
    }
    const filteredNotes = notes.filter((note) => {
        if (!note || typeof note !== 'object') return false;
        const searchTerm = search.toLowerCase();
        const title = (note.title || '').toLowerCase();
        const name = (note.name || '').toLowerCase();
        return title.includes(searchTerm) || name.includes(searchTerm);
    });
    // MARK: ノート削除
    const handleDeleteNote = async (id) => {
        await fetch(`/api/db?table=deleteNote&id=${id}`);
        fetchNotes();
    }
    // MARK: ノート復元
    const handleRestoreNote = async (id) => {
        await fetch(`/api/db?table=restoreNote&id=${id}`);
        fetchNotes();
    }

    // MARK: 項目切り替え
    useEffect(() => {
        if (active === "dashboard") {
            fetchDashboard();
        }
        if (active === "users") {
            fetchUsers();
        }
        if (active === "groups") {
            fetchGroups();
        }
        if (active === "roles") {
            fetchRoles();
        }
        if (active === "notes") {
            fetchNotes();
        }
    }, [active]);

    // MARK: MAIN ━━━━━━━━━
    return (
        <main className={styles.main}>
            <AdminHeader setActive={setActive}/>
            {active === "dashboard" && (
                <div className={styles.dashboardContent}>
                    <div className={styles.item}>
                        <LuUsersRound className={styles.icon} />
                    <p className={styles.itemTitle}>ユーザー数</p>
                    <p className={styles.itemValue}>{usersCount}</p>
                </div>
                <div className={styles.item}>
                    <FaObjectUngroup className={styles.icon} />
                    <p className={styles.itemTitle}>グループ数</p>
                    <p className={styles.itemValue}>{groupsCount}</p>
                </div>
                <div className={styles.item}>
                    <RiShieldUserFill className={styles.icon} />
                    <p className={styles.itemTitle}>ロール数</p>
                    <p className={styles.itemValue}>{rolesCount}</p>
                </div>
                <div className={styles.item}>
                        <PiNote className={styles.icon} />
                        <p className={styles.itemTitle}>ノート数</p>
                        <p className={styles.itemValue}>{notesCount}</p>
                    </div>
                </div>
            )}
            {active === "system" && (
                <div className={styles.systemContent}>
                    <p>System</p>
                </div>
            )}
            {active === "users" && (
                <div className={styles.usersContent}>
                    {modalUser  && (
                        <AdminUserInfo userInfo={selectedUserInfo} toggleModalAdminUserInfo={toggleModalAdminUserInfo} />
                    )}
                    <input type="search" placeholder="Search" className={styles.Search} onChange={(e) => setSearch(e.target.value)}/>
                    <table className={styles.Table}>
                        <thead>
                            <tr>
                                <th className={styles.tableId}>ID</th>
                                <th>username</th>
                                <th>Email</th>
                                <th className={styles.tableActions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} onClick={() => handleUserClick(user.id)}>
                                    <td style={user.delete ? {textDecoration: "line-through"} : {}}>{user.id}</td>
                                    <td style={user.delete ? {textDecoration: "line-through"} : {}}>{user.username}</td>
                                    <td style={user.delete ? {textDecoration: "line-through"} : {}}>{user.email}</td>
                                    <td>
                                        <div className={styles.usersTableBtns}>
                                            {/* <button className={styles.usersTableBtn}>Edit</button> */}
                                            {!user.delete ? (
                                                <button className={styles.deleteBtn} onClick={() => handleDeleteUser(user.id)}><MdDelete/></button>
                                            ) : (
                                                <button className={styles.restoreBtn} onClick={() => handleRestoreUser(user.id)}><MdOutlineRestore /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {active === "groups" && (
                <div className={styles.groupsContent}>
                    <input type="search" placeholder="Search" className={styles.Search} onChange={(e) => setSearch(e.target.value)}/>
                    <table className={styles.Table}>
                        <thead>
                            <tr>
                                <th className={styles.tableId}>ID</th>
                                <th>Name</th>
                                <th className={styles.tableActions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroups.map((group) => (
                                <tr key={group.id}>
                                    <td style={group.delete ? {textDecoration: "line-through"} : {}}>{group.id}</td>
                                    <td style={group.delete ? {textDecoration: "line-through"} : {}}>{group.name}</td>
                                    <td>
                                        <div className={styles.groupsTableBtns}>
                                            {!group.delete ? (
                                                <button className={styles.deleteBtn} onClick={() => handleDeleteGroup(group.id)}><MdDelete/></button>
                                            ) : (
                                                <button className={styles.restoreBtn} onClick={() => handleRestoreGroup(group.id)}><MdOutlineRestore /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {active === "roles" && (
                <div className={styles.rolesContent}>
                    <input type="search" placeholder="Search" className={styles.Search} onChange={(e) => setSearch(e.target.value)}/>
                    <table className={styles.Table}>
                        <thead>
                            <tr>
                                <th className={styles.tableId}>ID</th>
                                <th>Name</th>
                                <th className={styles.tableActions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map((role) => (
                                <tr key={role.id}>
                                    <td style={role.delete ? {textDecoration: "line-through"} : {}}>{role.id}</td>
                                    <td style={role.delete ? {textDecoration: "line-through"} : {}}>{role.name}</td>
                                    <td>
                                        <div className={styles.rolesTableBtns}>
                                            {!role.delete ? (
                                                <button className={styles.deleteBtn} onClick={() => handleDeleteRole(role.id)}><MdDelete/></button>
                                            ) : (
                                                <button className={styles.restoreBtn} onClick={() => handleRestoreRole(role.id)}><MdOutlineRestore /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}
            {active === "notes" && (
                <div className={styles.notesContent}>
                    <input type="search" placeholder="Search" className={styles.Search} onChange={(e) => setSearch(e.target.value)}/>
                    <table className={styles.Table}>
                        <thead>
                            <tr>
                                <th className={styles.tableId}>ID</th>
                                <th>Title</th>
                                <th>Group</th>
                                <th className={styles.tableActions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotes.map((note) => (
                                <tr key={note.id}>
                                    <td>{note.id}</td>
                                    <td>{note.title}</td>
                                    <td>{note.name}</td>
                                    <td>
                                        <div className={styles.groupsTableBtns}>
                                            {!note.delete ? (
                                                <button className={styles.deleteBtn} onClick={() => handleDeleteNote(note.id)}><MdDelete/></button>
                                            ) : (
                                                <button className={styles.restoreBtn} onClick={() => handleRestoreNote(note.id)}><MdOutlineRestore /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}