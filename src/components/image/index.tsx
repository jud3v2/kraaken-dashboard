import {useState} from 'react'
import {useQueryClient, useMutation} from 'react-query'
import {Image} from '../../types/image';

import {
    Card,
    Stack,
    Typography,
    Button,
    CardMedia,
    Divider
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import ImageUploading from 'react-images-uploading';

import { api } from '../../api'

import { toast } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

export default function ImageComponent(props: {images: Image[], productUUID: string}) {
    // Récupération des images
    const imagesProps: Image[] = props.images

    // Gestion des images
    const [images, setImages] = useState([]);
    const maxNumber: number = 5; // nombre maximum d'image qu'un produit peut avoir

    // React query client
    const queryClient = useQueryClient()   

    // React Router
    const navigate = useNavigate()
    
    // Créé une image via les mutation afin de mettre à jour le cache des produits
    const {isLoading, mutate, reset: createReset} = useMutation(async  () => {
        images.map(async (image: any) => {
            const formData = new FormData()
            console.log(image)
            formData.append('image', image.file)
            await api.imageCreate(formData, props.productUUID)
            .then(() => {
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de l\'ajout des images')
            })
        })

        setImages([])
        createReset()
        toast.loading('Image ajouté avec succès, rechargement dans 5 secondes...')
        setTimeout(() => {
            navigate(0) // this will refresh the current page.
        }, 5000)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products', props.productUUID])
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de l\'ajout des images')
        }
    })

    // Supprime complètement une image
    const {isLoading: isLoadingDelete, mutate: mutateDelete, reset} = useMutation(async (uuid: string) => {
        await api.imageDelete(uuid)
        .then(() => {
            toast.success('Image supprimé avec succès')
        })
        .catch(() => {
            toast.error('Une erreur est survenue lors de la suppression de l\'image')
        })
        reset()
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
            queryClient.invalidateQueries(['products', props.productUUID])
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de la suppression de l\'image')
        }
    })

    // Change l'image du produit en tant que première image à afficher en tant que vitrine
    const {isLoading: isLoadingFirst, mutate: mutateFirst, reset: resetIsFirst} = useMutation(async (uuid: string) => {
        await api.imageChangeToFirst(uuid, props.productUUID)
        .then(() => {
            toast.success('Image mise à jour avec succès')
        })
        .catch(() => {
            toast.error('Une erreur est survenue lors de la mise à jour de l\'image')
        })
        resetIsFirst()
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
        },
    })

    const handleSendImages = () => {
        if(images.length > 0) {
            mutate()
        } else {
            toast.error('Vous devez ajouter au moins une image')
        }
    }

    const removeImage = (event: any, uuid: string) => {
        event.preventDefault()
        if(window.confirm("Attention vous allez supprimer une image, êtes vous sûr de vouloir continuer ?")) {
            mutateDelete(uuid)
        }
    }

    const onChange = (imageList: any, addUpdateIndex: any) => {
        if(imageList.length > maxNumber) {
            toast.error(`Vous ne pouvez pas ajouter plus de ${maxNumber} images`)
        } else {
            setImages(imageList)
        }
    };

    const changeitToFirst = (e: any, uuid: string) => {
        e.preventDefault()
        mutateFirst(uuid)
    }

    return (
        <Card sx={{my: 2}}>
            <Stack sx={{m: 2}}>
            <Typography gutterBottom variant='h6'>
                Gestion des images
            </Typography>
            <Stack>
                        <Typography variant='subtitle1' sx={{mt: 3, mb: 1}}>
                            Les images afficher ci-dessous sont les images qui seront afficher sur le site.
                            De plus la taille de l'image afficher ci-dessous ne reflete pas la taille de l'image réel afficher sur le site web.
                            En choisissant une image comme première image, celle-ci sera afficher en tant que vitrine du produit.
                        </Typography>
                        <Typography variant='subtitle1' sx={{my: 1}}>
                            Vous pouvez au maximum ajouter 5 images jpeg ou png par produit et options.
                        </Typography>
                        <Typography variant='subtitle1' sx={{mb: 3, mt:1}}>
                            Veuillez noter que chacune de vos images seront optimiser pour le site web.
                        </Typography>
                    </Stack>
            <Stack sx={{my: 3}}>
                <Stack flexDirection={'row'} justifyContent={'space-around'} sx={{height: '10rem'}}>
                    {imagesProps.length > 0 ? imagesProps.map((image: Image, index: number) => (
                    <div key={index} className="image-item">
                        <Stack sx={{mx: 1, width: '140px', height: '140px'}}>
                            <CardMedia sx={{maxWidth: '100%', maxHeight: '100%', borderRadius: 2}} component='img' image={api.imageGet(image.path)}/>
                            <Stack flexDirection={'row'} sx={{my: 1}} justifyContent={'space-around'}>
                                {image.isFirst 
                                ? <LoadingButton color='success' variant='contained'size='small'>Premier</LoadingButton> 
                                : <LoadingButton loading={isLoadingFirst} variant='contained' onClick={(e: any) => changeitToFirst(e, image.uuid)} size='small'>Premier</LoadingButton>}
                                <LoadingButton loading={isLoadingDelete} variant='contained' color='error' onClick={(e: any) => removeImage(e, image.uuid)} size='small'>Remove</LoadingButton>
                            </Stack>
                        </Stack>
                    </div>
                    )) : <>
                        <Typography>
                            Aucune image n'a été ajouté pour le moment
                        </Typography>
                    </>}
                </Stack>
            </Stack>
            <Divider sx={{my: 4}} />
            {imagesProps.length < maxNumber ? <>
            <Stack sx={{my: 2}}>
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={['jpg', 'png']}
            >
                {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                    <Button
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    variant='contained'
                    disabled={maxNumber === imagesProps.length}
                    {...dragProps}
                    >
                    Cliquer ici pour ajouter des images
                    </Button>
                    &nbsp;
                    <Button variant='contained' color='error' onClick={onImageRemoveAll}>Supprimer les images</Button>
                    </Stack>
                    <Typography sx={{my: 3}} align={'center'} variant='h4'>
                            Prévisualisation des nouvelle images
                        </Typography>
                    <Stack flexDirection={'row'} justifyContent={'space-around'} sx={{height: '10rem'}}>
                        {imageList.length > 0 ? imageList.map((image: any, index: number) => (
                        <div key={index} className="image-item">
                            <Stack sx={{mx: 1, width: '140px', height: '140px'}}>
                                <CardMedia sx={{maxWidth: '100%', maxHeight: '100%', borderRadius: 2}} component='img' src={image.data_url}/>
                                <Stack flexDirection={'row'} sx={{my: 1}} justifyContent={'space-around'}>
                                    <Button variant='contained' size='small' onClick={() => onImageUpdate(index)}>Update</Button>
                                    <Button variant='contained' color='error' size='small' onClick={() => onImageRemove(index)}>Remove</Button>
                                </Stack>
                            </Stack>
                        </div>
                        )) : <Typography>
                        Aucune image à prévisualiser pour le moment, veuillez en ajouter
                    </Typography> }
                    </Stack>
                    <Stack sx={{my: 2}}>
                        <LoadingButton variant='contained' sx={{mt: 2}} onClick={handleSendImages} loading={isLoading}>
                            Envoyer les images
                        </LoadingButton>
                    </Stack>
                </div>
                )}
            </ImageUploading>
            </Stack>
            </> : <Typography variant='subtitle1' align='center'>
                Vous avez atteint le nombre maximum d'image pour ce produit, supprimer des images pour en ajouter de nouvelles    
            </Typography>}
            </Stack>
        </Card>
    )

}