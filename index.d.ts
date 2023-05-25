/**
 * Return the main color from an online image.
 * 
 * It will cache the color found for the URL for 24h to reduce the number of HTTPS request.
 * @param url URL to an online image
 */
export function fromImageUrl(url: string): Promise<{
    /** Between 0 and 255 */
    r: number,
    /** Between 0 and 255 */
    g: number,
    /** Between 0 and 255 */
    b: number,
    /** Return the color hex format `#RRGGBB` */
    toHex: () => string
}>;

/**
 * This function will search for a favicon in Google cache and return its main color.
 * 
 * It will cache the color associated with the URL for 24h to reduce the number of HTTPS request.
 * @param url Website URL
 */
export function fromSiteFavicon(url: string): Promise<{
    /** Between 0 and 255 */
    r: number,
    /** Between 0 and 255 */
    g: number,
    /** Between 0 and 255 */
    b: number,
    /** Return the color hex format `#RRGGBB` */
    toHex: () => string
}>;
