import { useState, useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { Image } from '../types/image';

import {
    Card,
    Stack,
    Typography,
    Button,
    CardMedia,
    Divider,
    Container
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import ImageUploading from 'react-images-uploading';

import { api } from '../api'

import { toast } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';

import { Option } from '../types/option'

import { ClimbingBoxLoader } from 'react-spinners';

import { useParams } from 'react-router-dom';

export default function OptionPage(props: any) {
    const { uuid } = useParams<{uuid: string}>();
    const option_uuid: string = uuid ? uuid : ''

    const [result, setResult] = useState<Option>()
    console.log(result)
    const {
        isLoading: optionLoading,
        refetch: optionRefetch,
    } = useQuery(['options', uuid], async () => {
        const serverResponse = await api.optionGetOne(uuid)
        setResult(serverResponse)
    }, {
        // 10 minutes
        staleTime: 1000 * 60 * 10,
    })


    // Gestion des images
    const [images, setImages] = useState([]);
    const maxNumber: number = 5; // nombre maximum d'image qu'un produit peut avoir

    // React query client
    const queryClient = useQueryClient()

    // React Router
    const navigate = useNavigate()

    // Créé une image via les mutation afin de mettre à jour le cache des produits
    const { isLoading, mutate, reset: createReset } = useMutation(async () => {
        images.map(async (image: any) => {
            const formData = new FormData()
            formData.append('image', image.file)
            formData.append('option_uuid', uuid ? uuid : '')
            await api.imageCreate(formData, result?.product_uuid)
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
            queryClient.invalidateQueries(['options', uuid])
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de l\'ajout des images')
        }
    })

    // Supprime complètement une image
    const { isLoading: isLoadingDelete, mutate: mutateDelete, reset } = useMutation(async (uuid: string) => {
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
            if(result) {
                queryClient.invalidateQueries(['options', uuid])
            }
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de la suppression de l\'image')
        }
    })

    // Change l'image du produit en tant que première image à afficher en tant que vitrine
    const { isLoading: isLoadingFirst, mutate: mutateFirst, reset: resetIsFirst } = useMutation(async (uuid: string) => {
        if(result) {
            await api.imageChangeToFirst(uuid, option_uuid)
            .then(() => {
                toast.success('Image mise à jour avec succès')
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la mise à jour de l\'image')
            })
            resetIsFirst()
        }
    }, {
        onSuccess: () => {
            if(result) {
                queryClient.invalidateQueries(['options', uuid])
            }
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de la mise à jour de l\'image')
        }
    })

    const handleSendImages = () => {
        if (images.length > 0) {
            mutate()
        } else {
            toast.error('Vous devez ajouter au moins une image')
        }
    }

    const removeImage = (event: any, uuid: string) => {
        event.preventDefault()
        if (window.confirm("Attention vous allez supprimer une image, êtes vous sûr de vouloir continuer ?")) {
            mutateDelete(uuid)
        }
    }

    const onChange = (imageList: any, addUpdateIndex: any) => {
        if (imageList.length > maxNumber) {
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
        
        <>
            {optionLoading ? <Stack sx={{width: '100%'}} justifyContent='center' justifyItems='center'>
        <ClimbingBoxLoader  cssOverride={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          width: '100%',
          marginTop: '20%',
      }} />
      </Stack> : <>
      <Helmet>
          <title> Lizaora | Option </title>
      </Helmet>

      <Container>
      <Card sx={{ my: 2 }}>
          <Stack sx={{ m: 2 }}>
              <Typography gutterBottom variant='h6'>
                  Gestion des images de l'option: {result?.name}
              </Typography>
              <Stack>
                  <Typography variant='subtitle1' sx={{ mt: 3, mb: 1 }}>
                      Les images afficher ci-dessous sont les images qui seront afficher sur le site.
                      De plus la taille de l'image afficher ci-dessous ne reflete pas la taille de l'image réel afficher sur le site web.
                      En choisissant une image comme première image, celle-ci sera afficher en tant que vitrine du produit.
                  </Typography>
                  <Typography variant='subtitle1' sx={{ my: 1 }}>
                      Vous pouvez au maximum ajouter 5 images jpeg ou png par produit et options.
                  </Typography>
                  <Typography variant='subtitle1' sx={{ mb: 3, mt: 1 }}>
                      Veuillez noter que chacune de vos images seront optimiser pour le site web.
                  </Typography>
              </Stack>
              <Stack sx={{ my: 3 }}>
                  <Stack flexDirection={'row'} justifyContent={'space-around'} sx={{ height: '10rem' }}>
                      {result && result.productImage.length > 0 ? result.productImage.map((image: Image, index: number) => (
                          <div key={index} className="image-item">
                              <Stack sx={{ mx: 1, width: '140px', height: '140px' }}>
                                  <CardMedia sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 2 }} component='img' image={api.imageGet(image.path)} />
                                  <Stack flexDirection={'row'} sx={{ my: 1 }} justifyContent={'space-around'}>
                                      {image.isFirst
                                          ? <LoadingButton color='success' variant='contained' size='small'>Premier</LoadingButton>
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
              <Divider sx={{ my: 4 }} />
              {result && result.productImage.length < maxNumber ? <>
                  <Stack sx={{ my: 2 }}>
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
                                          disabled={maxNumber === result.productImage.length}
                                          {...dragProps}
                                      >
                                          Cliquer ici pour ajouter des images
                                      </Button>
                                      &nbsp;
                                      <Button variant='contained' color='error' onClick={onImageRemoveAll}>Supprimer les images</Button>
                                  </Stack>
                                  <Typography sx={{ my: 3 }} align={'center'} variant='h4'>
                                      Prévisualisation des nouvelle images
                                  </Typography>
                                  <Stack flexDirection={'row'} justifyContent={'space-around'} sx={{ height: '10rem' }}>
                                      {imageList.length > 0 ? imageList.map((image: any, index: number) => (
                                          <div key={index} className="image-item">
                                              <Stack sx={{ mx: 1, width: '140px', height: '140px' }}>
                                                  <CardMedia sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 2 }} component='img' src={image.data_url} />
                                                  <Stack flexDirection={'row'} sx={{ my: 1 }} justifyContent={'space-around'}>
                                                      <Button variant='contained' size='small' onClick={() => onImageUpdate(index)}>Update</Button>
                                                      <Button variant='contained' color='error' size='small' onClick={() => onImageRemove(index)}>Remove</Button>
                                                  </Stack>
                                              </Stack>
                                          </div>
                                      )) : <Typography>
                                          Aucune image à prévisualiser pour le moment, veuillez en ajouter
                                      </Typography>}
                                  </Stack>
                                  <Stack sx={{ my: 2 }}>
                                      <LoadingButton variant='contained' sx={{ mt: 2 }} onClick={handleSendImages} loading={isLoading}>
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
  </Container>
  </>}
        </>
    )
}