import classnames from "classnames"

export default function Tile({ character }) {
    const className = classnames("tile", {
        "tile-blank": character === " ",
        "tile-censored": character === "*"
    })

    const formattedCharacter = character === "*"
        ? ""
        : character

    return <span className={className}>{formattedCharacter}</span>
}