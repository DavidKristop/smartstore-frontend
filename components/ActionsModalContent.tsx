"use client"

import {File_} from "@/types";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import {convertFileSize, formatDateTime} from "@/lib/utils";
import {getUserById, getUserFullName} from "@/lib/actions/user.actions";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }: { file: File_ }) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col">
            <p className="subtitle-2 mb-1">{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className="caption" />
        </div>
    </div>
)

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex">
        <p className="file-details-label">{label}</p>
        <p className="file-details-value">{value}</p>
    </div>
)

export const FileDetails = ({ file }: { file: File_ }) => {
    const [ownerName, setOwnerName] = useState<string | null>(null);
    useEffect(() => {
        const fetchOwner = async () => {
            const name = await getUserFullName(file.owner);
            setOwnerName(name);
        };

        fetchOwner();
    }, [file.owner]);

    return (
        <>
            <ImageThumbnail file={file} />
            <div className="space-x-4 px-2 pt-2">
                <DetailRow label="Format:" value={file.extension}/>
                <DetailRow label="Size:" value={convertFileSize(file.size)}/>
                <DetailRow label="Owner:" value={ownerName || "Unknown User"}/>
                <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)}/>
            </div>
        </>
    )
}

interface Props {
    file: File_;
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>
    onRemove: (email: string) => void
}

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
    return (
        <>
            <ImageThumbnail file={file} />

            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">Share file with other users</p>

                <Input
                    type="email"
                    placeholder="Enter email address"
                    onChange={e => onInputChange(e.target.value.trim().split(','))}
                    className="share-input-field"
                />

                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">Shared with</p>
                        <p className="subtitle-2 text-light-200">{file.users.length} users</p>
                    </div>

                    <ul className="pt-2">
                        {file.users.map((email: string) => (
                            <li key={email} className="flex items-center justify-between gap-2">
                                <p className="subtitle-2 text-light-100">
                                    {email}
                                </p>

                                <Button onClick={() => onRemove(email)} className="share-remove-user">
                                    <Image
                                        src="/assets/icons/remove.svg"
                                        alt="remove"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </>
    )
}