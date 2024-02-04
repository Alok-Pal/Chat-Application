import prisma from "../../prisma/index.js"

class User {
    async getUserOnLogin(req, res) {
        const name = req.body.name
        try {
            const resUser = await prisma.user.findMany({
                where: {
                    name: req.body.name
                }
            })
        } catch (error) {
        }
    }

    async createUserOnRegister(req, res) {
        const name = req.body.name;
    
        try {
            if (name) {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        name: req.body.name
                    }
                });
    
                if (existingUser) {
                    throw new Error('User already exists');
                } else {
                    const newUser = await prisma.user.create({
                        data: {
                            name: req.body.name
                        }
                    });
                    res.send(newUser);
                }
            } else {
                throw new Error('Name is required');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    

}

export default new User();