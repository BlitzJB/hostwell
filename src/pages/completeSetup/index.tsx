import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { Form } from "../../components/forms";
import { FormStep } from "../../components/forms";
import { TextField, ImageUpload, TextAreaField } from "../../components/forms";
import Nav from "../../components/nav/Nav";

import { User } from "@prisma/client";

import { api } from "../../utils/api";


interface CompleteSetupProps {}

const CompleteSetup: React.FC<CompleteSetupProps> = ({}) => {

    const [currentStep, setCurrentStep] = React.useState(1);

    const userQuery = api.account.me.useQuery();
    const updateMeMutation = api.account.updateMe.useMutation();
    const router = useRouter()
    
    const [name, setName] = React.useState("");
    const [avatar, setAvatar] = React.useState("");
    const [bio, setBio] = React.useState("");

    useEffect(() => {
        if (userQuery.data) {
            setName(userQuery.data.name || "");
            setAvatar(userQuery.data.avatar || "");
            setBio(userQuery.data.bio || "");
        }
    }, [userQuery.data])

    const formData = {
        name,
        avatar,
        bio
    }

    return (<>
        <Nav />

        <Form currentStep={currentStep} formData={formData} onSubmit={(data) => { updateMeMutation.mutate(formData); router.push('/profile') }}>
            <FormStep
                currentStep={currentStep}
                stepIndex={1}
            >
                <TextField
                    label="Name"
                    value={name}
                    setValue={setName}
                />
                <button onClick={() => setCurrentStep(p => p+1)}>Next</button>
            </FormStep>
            <FormStep
                currentStep={currentStep}
                stepIndex={2}
            >
                <ImageUpload
                    label="Avatar"
                    setUrl={setAvatar}
                />
                <button onClick={() => setCurrentStep(p => p+1)}>Next</button>
            </FormStep>
            <FormStep
                currentStep={currentStep}
                stepIndex={3}
            >
                <TextAreaField
                    label="Bio"
                    value={bio}
                    setValue={setBio}
                />
                <button onClick={() => setCurrentStep(p => p+1)}>Next</button>
            </FormStep>
        </Form>

        {
            !userQuery.data && <p>Loading...</p>
        }

    </>)
}


export default CompleteSetup