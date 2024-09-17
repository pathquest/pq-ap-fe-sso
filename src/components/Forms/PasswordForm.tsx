import { handleSignOut } from '@/actions/server/auth'
import agent from '@/api/axios'
import { useRouter } from 'next/navigation'
import { Button, Password, Toast, Typography } from 'pq-ap-lib'
import { useState } from 'react'

type PasswordFormProps = {
  profileData?: any | null
  handleEdit: (arg1: boolean, arg2: string) => void
}

const PasswordForm = ({ profileData, handleEdit }: any) => {
  const router = useRouter()

  const [currentPwd, setCurrentPwd] = useState<string>('')
  const [currentPwdErr, setCurrentPwdErr] = useState<boolean>(false)
  const [currentPwdHasNoErr, setCurrentPwdHasNoErr] = useState<boolean>(false)
  const [newPwd, setNewPwd] = useState<string>('')
  const [newPwdErr, setNewPwdErr] = useState<boolean>(false)
  const [newPwdHasNoErr, setNewPwdHasNoErr] = useState<boolean>(false)
  const [confirmPwd, setConfirmPwd] = useState<string>('')
  const [confirmPwdErr, setConfirmPwdErr] = useState<boolean>(false)
  const [confirmPwdHasNoErr, setConfirmPwdHasNoErr] = useState<boolean>(false)
  const [isMatched, setIsMatched] = useState<boolean>(true)
  const [isSameAsCurrentPwd, setIsSameAsCurrentPwd] = useState<boolean>(false)

  const validate = () => {
    return currentPwdHasNoErr && newPwdHasNoErr && confirmPwdHasNoErr && isMatched && !isSameAsCurrentPwd ? true : false
  }
  const updatePassword = async () => {
    try {
      const response = await agent.APIs.updatePassword({
        currentPassword: currentPwd,
        newPassword: newPwd,
      })

      if (response.ResponseStatus === 'Success') {
        Toast.success('Password updated successfully!')
        router.push('/signin')
        await handleSignOut()
      }
      if (response.ResponseStatus === 'Failure') {
        Toast.error(response.Message === null ? 'Something went wrong!' : response.Message)
        handleEdit(false, '')
      }
    } catch (error) {
      Toast.error('Something went wrong!')
      handleEdit(false, '')
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    currentPwd === '' ? setCurrentPwdErr(true) : setCurrentPwdErr(false)
    newPwd === '' || newPwd === currentPwd ? setNewPwdErr(true) : setNewPwdErr(false)
    confirmPwd === '' ? setConfirmPwdErr(true) : setConfirmPwdErr(false)
    newPwd === confirmPwd ? setIsMatched(true) : setIsMatched(false)
    currentPwd === newPwd ? setIsSameAsCurrentPwd(true) : setIsSameAsCurrentPwd(false)

    if (validate()) {
      updatePassword()
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex max-h-[70vh] flex-col gap-[20px] overflow-y-auto p-[20px]'>
          <Password
            label='Current Password'
            placeholder='Enter Current Password'
            value={currentPwd}
            validate
            novalidate
            autoComplete='off'
            hasError={currentPwdErr}
            getValue={(value) => setCurrentPwd(value)}
            getError={(err) => setCurrentPwdHasNoErr(err)}
          />
          <Password
            label='New Password'
            placeholder='Enter New Password'
            value={newPwd}
            // novalidate
            direction='bottom'
            validate
            autoComplete='off'
            hasError={newPwdErr || isSameAsCurrentPwd}
            errorMessage='The current password and the new password cannot be the same!'
            minChar={8}
            maxChar={16}
            getValue={(value) => {
              setNewPwd(value)
              value === confirmPwd ? setIsMatched(true) : setIsMatched(false)
              value === currentPwd ? setIsSameAsCurrentPwd(true) : setIsSameAsCurrentPwd(false)
            }}
            getError={(err) => setNewPwdHasNoErr(err)}
          />
          <Password
            label='Confirm Password'
            placeholder='Enter Confirm Password'
            value={confirmPwd}
            validate
            novalidate
            autoComplete='off'
            hasError={confirmPwdErr}
            getValue={(value) => {
              setConfirmPwd(value)
              value === newPwd ? setIsMatched(true) : setIsMatched(false)
            }}
            getError={(err) => setConfirmPwdHasNoErr(err)}
          />
          {(!isMatched && !isSameAsCurrentPwd) && <span className='-mt-3 text-xs text-defaultRed lg:text-sm'>Password does not match!</span>}
        </div>
        <div className='sticky bottom-0 flex  w-full items-center justify-end border-t border-lightSilver bg-white'>
          <div className='mx-5 my-3 flex'>
            <Button
              className='mx-3  w-28 rounded-full xsm:!px-1'
              variant='btn-outline-primary'
              onClick={() => handleEdit(false, '')}
            >
              <Typography type='h6' className='!font-bold'>
                CANCEL
              </Typography>
            </Button>
            <Button className={`w-28 rounded-full !text-[14px] xsm:!px-1`} variant='btn-primary' type='submit'>
              <Typography type='h6' className='!font-bold'>
                SAVE
              </Typography>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PasswordForm
