import crypto from 'crypto'

class Password{
    constructor(password){
        const enc = crypto.createCipheriv('aes-256-gcm', Buffer.from('NTCfzeGC7XtpBpDiWvSbyy2NUt0gEDji'), 'as')
        const hash = crypto.createHash('sha256')
        this.value = hash.update(enc.update(password).toString('utf8')).digest().toString('hex')
    }
}

export default Password