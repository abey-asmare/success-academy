export function getResourceURL(resourceUrl: string) {
    return resourceUrl.includes('.ufs.sh') ? resourceUrl : `${process.env.NEXT_PUBLIC_R2_EXPOSE_CONTENT_THROUGH}/${resourceUrl}`
}