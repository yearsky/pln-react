import { Head, useForm, usePage } from '@inertiajs/react';
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
        href: '/maintenance/vendor',
    },
];

interface Vendor {
    id: number;
    nama_vendor: string;
    types: string;
}

interface Props extends SharedData {
    vendors: Vendor[];
}

export default function Vendor({ vendors }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editVendorId, setEditVendorId] = useState<number | null>(null);
    const [deleteVendorId, setDeleteVendorId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [flashMessage, setFlashMessage] = useState<{ success?: string; error?: string } | null>(null);
    const [showFlash, setShowFlash] = useState(false);

    const confirmationInput = useRef<HTMLInputElement>(null);

    // Form untuk tambah vendor
    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: addReset } = useForm({
        nama_vendor: '',
        types: '',
    });

    // Form untuk edit vendor
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        nama_vendor: '',
        types: '',
    });

    // Form untuk delete vendor
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing: deleteProcessing, errors: deleteErrors, reset: deleteReset, clearErrors: deleteClearErrors } = useForm({
        confirmation: '',
    });

    const submitAdd: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('maintenance.vendor.store'), {
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

        if (editVendorId === null) return;

        put(route('maintenance.vendor.update', editVendorId), {
            onSuccess: (page) => {
                editReset();
                setEditVendorId(null);
                const newFlash = page.props.flash as { success?: string; error?: string };
                setFlashMessage(newFlash);
                setShowFlash(true);
            },
            preserveScroll: true,
        });
    };

    const handleEdit = (vendor: Vendor) => {
        setEditVendorId(vendor.id);
        setEditData({
            nama_vendor: vendor.nama_vendor,
            types: vendor.types,
        });
    };

    const handleDelete = (vendorId: number) => {
        setDeleteVendorId(vendorId);
        setIsDeleteModalOpen(true);
    };

    const submitDelete: FormEventHandler = (e) => {
        e.preventDefault();

        if (deleteVendorId === null) return;

        destroy(route('maintenance.vendor.destroy', deleteVendorId), {
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
        setDeleteVendorId(null);
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

    const { flash } = usePage<SharedData>().props;
    console.log('Flash from props:', flash);
    console.log('Flash from state:', flashMessage);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance - Vendor" />

            <div className="px-4 py-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Maintenance - Vendor</h1>
                        <Button onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel' : 'Add Vendor'}
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

                    {/* Form Add Vendor */}
                    {showForm && (
                        <form onSubmit={submitAdd} className="mb-6 space-y-4 rounded-lg bg-white p-6 shadow-md">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_vendor">Nama Vendor</Label>
                                <Input
                                    id="nama_vendor"
                                    value={addData.nama_vendor}
                                    onChange={(e) => setAddData('nama_vendor', e.target.value)}
                                    required
                                    placeholder="Nama vendor"
                                />
                                <InputError message={addErrors.nama_vendor} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="types">Tipe</Label>
                                <select
                                    id="types"
                                    value={addData.types}
                                    onChange={(e) => setAddData('types', e.target.value)}
                                    className="rounded-md border p-2"
                                >
                                    <option value="jasa">Jasa</option>
                                    <option value="tibet">Tibet</option>
                                </select>
                                <InputError message={addErrors.types} />
                            </div>

                            <Button type="submit" disabled={addProcessing}>
                                Save
                            </Button>
                        </form>
                    )}

                    {/* Form Edit Vendor */}
                    {editVendorId !== null && (
                        <form onSubmit={submitEdit} className="mb-6 space-y-4 rounded-lg bg-white p-6 shadow-md">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_nama_vendor">Nama Vendor</Label>
                                <Input
                                    id="edit_nama_vendor"
                                    value={editData.nama_vendor}
                                    onChange={(e) => setEditData('nama_vendor', e.target.value)}
                                    required
                                    placeholder="Nama vendor"
                                />
                                <InputError message={editErrors.nama_vendor} />
                            </div>

                             <div className="grid gap-2">
                                <Label htmlFor="edit_types_vendor">Tipe</Label>
                                <select
                                    id="edit_types_vendor"
                                    value={editData.types}
                                    onChange={(e) => setEditData('types', e.target.value)}
                                    className="rounded-md border p-2"
                                >
                                    <option value="jasa">Jasa</option>
                                    <option value="tibet">Tibet</option>
                                </select>
                                <InputError message={editErrors.types} />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={editProcessing}>
                                    Update
                                </Button>
                                <Button variant="outline" onClick={() => setEditVendorId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Tabel Daftar Vendor */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Nama Vendor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Tipe Vendor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {vendors.map((vendor,index) => (
                                    <tr key={vendor.id}>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-90 uppercase">
                                            {vendor.nama_vendor}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 uppercase">
                                            {vendor.types}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(vendor)}
                                                className="mr-2 text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                                                <DialogTrigger asChild>
                                                    <button
                                                        onClick={() => handleDelete(vendor.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Are you sure you want to delete this vendor?</DialogTitle>
                                                    <DialogDescription>
                                                        Once this vendor is deleted, all related data will be permanently deleted. Please type <strong>"delete"</strong> to confirm.
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
                                                                <button type="submit">Delete Vendor</button>
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
