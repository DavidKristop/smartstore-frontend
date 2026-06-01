"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import Image from "next/image";
import { ActionType, File_ } from "@/types";
import { actionsDropdownItems } from "@/constants/actionsDropdownItems";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {deleteFile, renameFile, updateFileUsers} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import ApryseViewer from "./ApryseViewer";

const SUPPORTED_EDIT_EXTENSIONS = [
    "pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt"
];

const ActionDropdown = ({ file }: { file: File_ }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [action, setAction] = useState<ActionType | null>(null)
    const [name, setName] = useState(file.name)
    const [isLoading, setIsLoading] = useState(false)
    const [emails, setEmails] = useState<string[]>([])

    const path = usePathname();

    const closeAllModals = () => {
        setIsModalOpen(false)
        setIsDropdownOpen(false)
        setAction(null)
        setName(file.name)
    }

    const handleAction = async () => {
        if(!action) return null
        setIsLoading(true)
        let success = false

        const actions = {
            rename: () => renameFile({ fileId: file.$id, name, extension: file.extension, path }),
            share: () => updateFileUsers({ fileId: file.$id, emails: file.users, path }),
            delete: () => deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
            edit: () => Promise.resolve(true),
        }

        // @ts-ignore
        success = await actions[action.value as keyof typeof actions]()

        if(success) closeAllModals()
        setIsLoading(false)
    }

    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email)
        const success = await updateFileUsers({ fileId: file.$id, emails: file.users, path })
        if(success) setEmails(updatedEmails)
        closeAllModals()
    }

    const renderDialogContent = () => {
        if(!action) return null

        const { value, label } = action
        return (
            <DialogContent className={`p-8 ${value === "edit" ? "max-w-5xl w-full" : "shad-dialog"}`} aria-describedby={undefined}>
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className={value === "edit" ? "sr-only" : "text-center text-light-100"}>
                        {label}
                    </DialogTitle>

                    {value === "rename" && (
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    )}

                    {value === "details" && <FileDetails file={file} />}

                    {value === "share" && (
                        <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser}/>
                    )}

                    {value === "edit" && (
                        <ApryseViewer file={file} path={path} closeModals={closeAllModals} />
                    )}

                    {value === "delete" && (
                        <p className="delete-confirmation">
                            Are you sure you want to delete{` `}
                            <span className="delete-file-name">{file.name}</span>?
                        </p>
                    )}
                </DialogHeader>

                {["rename", "delete", "share"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button onClick={closeAllModals} className="modal-cancel-button cursor-pointer bg-red py-2 rounded-full">
                            Cancel
                        </Button>
                        <Button onClick={handleAction} className="modal-submit-button cursor-pointer py-2 rounded-full">
                            <p className="capitalize">{value}</p>
                        </Button>
                    </DialogFooter>
                )}

                {isLoading && (
                    <div className="flex justify-center mt-4">
                        <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="animate-spin" />
                    </div>
                )}
            </DialogContent>
        )
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild className="shad-no-focus">
                    <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">{file.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {actionsDropdownItems
                        .filter((item) => {
                            if (item.value === "edit") {
                                return SUPPORTED_EDIT_EXTENSIONS.includes(file.extension?.toLowerCase());
                            }
                            return true;
                        })
                        .map((item) => (
                            <DropdownMenuItem key={item.value} className="shad-dropdown-item" onClick={() => {
                                setAction(item)
                                if(["rename", "share", "delete", "details", "edit"].includes(item.value)) {
                                    setIsModalOpen(true)
                                }
                            }}>
                                {item.value === "download" ?
                                    <Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className="flex items-center gap-2">
                                        <Image src={item.icon} alt={item.label} width={30} height={30} />
                                        {item.label}
                                    </Link> :
                                    <div className="flex items-center gap-2">
                                        <Image src={item.icon} alt={item.label} width={30} height={30} />
                                        {item.label}
                                    </div>
                                }
                            </DropdownMenuItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {renderDialogContent()}
        </Dialog>
    )
}

export default ActionDropdown