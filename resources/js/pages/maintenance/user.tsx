import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SharedData, BreadcrumbItem } from '@/types';
import { FormEventHandler, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Maintenance',
        href: '/maintenance/user',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    user_roles: string;
}

interface Props extends SharedData {
    users: User[];
}

export default function User({ users }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [flashMessage, setFlashMessage] = useState<{ success?: string; error?: string } | null>(null);
    const [showFlash, setShowFlash] = useState(false);

    const confirmationInput = useRef<HTMLInputElement>(null);

    // Form untuk tambah user
    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: addReset } = useForm({
        name: '',
        email: '',
        password: '',
        user_roles: 'user',
    });

    // Form untuk edit user
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        name: '',
        email: '',
        user_roles: '',
    });

    // Form untuk delete user
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing: deleteProcessing, errors: deleteErrors, reset: deleteReset, clearErrors: deleteClearErrors } = useForm({
        confirmation: '', // Ganti password dengan confirmation
    });

    const submitAdd: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('maintenance.user.store'), {
            onSuccess: (page) => {
                addReset();
                setShowForm(false);
                const newFlash = page.props.flash as { success?: string; error?: string };
                setFlashMessage(newFlash);
                setShowFlash(true);
            },
            preserveScroll: true,
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editUserId === null) return;

        put(route('maintenance.user.update', editUserId), {
            onSuccess: (page) => {
                editReset();
                setEditUserId(null);
                const newFlash = page.props.flash as { success?: string; error?: string };
                setFlashMessage(newFlash);
                setShowFlash(true);
            },
            preserveScroll: true,
        });
    };

    const handleEdit = (user: User) => {
        setEditUserId(user.id);
        setEditData({
            name: user.name,
            email: user.email,
            user_roles: user.user_roles,
        });
    };

    const handleDelete = (userId: number) => {
        setDeleteUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const submitDelete: FormEventHandler = (e) => {
        e.preventDefault();

        if (deleteUserId === null) return;

        destroy(route('maintenance.user.destroy', deleteUserId), {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsDeleteModalOpen(false);
                deleteReset();
                const newFlash = page.props.flash as { success?: string; error?: string };
                setFlashMessage(newFlash);
                setShowFlash(true);
            },
            onError: () => confirmationInput.current?.focus(),
            onFinish: () => deleteReset(),
        });
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        deleteClearErrors();
        deleteReset();
        setDeleteUserId(null);
    };

    useEffect(() => {
        if (flashMessage && (flashMessage.success || flashMessage.error)) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
                setFlashMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flashMessage]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance - User" />

            <div className="px-4 py-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Maintenance - User</h1>
                        <Button onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel' : 'Add User'}
                        </Button>
                    </div>

                    {showFlash && flashMessage?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                            {flashMessage.success}
                        </div>
                    )}
                    {showFlash && flashMessage?.error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {flashMessage.error}
                        </div>
                    )}

                    {/* Form Add User */}
                    {showForm && (
                        <form onSubmit={submitAdd} className="mb-6 space-y-4 rounded-lg bg-white p-6 shadow-md">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={addData.name}
                                    onChange={(e) => setAddData('name', e.target.value)}
                                    required
                                    placeholder="Full name"
                                />
                                <InputError message={addErrors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={addData.email}
                                    onChange={(e) => setAddData('email', e.target.value)}
                                    required
                                    placeholder="Email address"
                                />
                                <InputError message={addErrors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={addData.password}
                                    onChange={(e) => setAddData('password', e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                                <InputError message={addErrors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="user_roles">Role</Label>
                                <select
                                    id="user_roles"
                                    value={addData.user_roles}
                                    onChange={(e) => setAddData('user_roles', e.target.value)}
                                    className="rounded-md border p-2"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="vendor">Vendor</option>
                                </select>
                                <InputError message={addErrors.user_roles} />
                            </div>

                            <Button type="submit" disabled={addProcessing}>
                                Save
                            </Button>
                        </form>
                    )}

                    {/* Form Edit User */}
                    {editUserId !== null && (
                        <form onSubmit={submitEdit} className="mb-6 space-y-4 rounded-lg bg-white p-6 shadow-md">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_name">Name</Label>
                                <Input
                                    id="edit_name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    required
                                    placeholder="Full name"
                                />
                                <InputError message={editErrors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_email">Email</Label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData('email', e.target.value)}
                                    required
                                    placeholder="Email address"
                                />
                                <InputError message={editErrors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_user_roles">Role</Label>
                                <select
                                    id="edit_user_roles"
                                    value={editData.user_roles}
                                    onChange={(e) => setEditData('user_roles', e.target.value)}
                                    className="rounded-md border p-2"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="vendor">Vendor</option>
                                </select>
                                <InputError message={editErrors.user_roles} />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={editProcessing}>
                                    Update
                                </Button>
                                <Button variant="outline" onClick={() => setEditUserId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Tabel Daftar User */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {user.user_roles}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="mr-2 text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                                                <DialogTrigger asChild>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                                                    <DialogDescription>
                                                        Once this user is deleted, all of their resources and data will be permanently deleted. Please type <strong>"delete"</strong> to confirm.
                                                    </DialogDescription>
                                                    <form className="space-y-6" onSubmit={submitDelete}>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="confirmation" className="sr-only">
                                                                Confirmation
                                                            </Label>
                                                            <Input
                                                                id="confirmation"
                                                                type="text"
                                                                name="confirmation"
                                                                ref={confirmationInput}
                                                                value={deleteData.confirmation}
                                                                onChange={(e) => setDeleteData('confirmation', e.target.value)}
                                                                placeholder='Type "delete" to confirm'
                                                            />
                                                            <InputError message={deleteErrors.confirmation} />
                                                        </div>

                                                        <DialogFooter className="gap-2">
                                                            <DialogClose asChild>
                                                                <Button variant="secondary" onClick={closeDeleteModal}>
                                                                    Cancel
                                                                </Button>
                                                            </DialogClose>
                                                            <Button variant="destructive" disabled={deleteProcessing} asChild>
                                                                <button type="submit">Delete User</button>
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
